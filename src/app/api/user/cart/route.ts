import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/sanity.server';

interface CartItem {
    _type: 'reference';
    _ref: string;
}

// GET - Fetch user's cart
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Fetch user with populated cart items
        const user = await serverClient.getDocument(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If no cart items, return empty array
        if (!user.cart || user.cart.length === 0) {
            return NextResponse.json({
                cartItems: [],
                totalItems: 0,
                totalPrice: 0
            });
        }

        // Fetch cart items with product details
        const cartItems = await serverClient.getDocuments(
            user.cart.map((item: CartItem) => item._ref)
        );

        // Add discounted prices to each cart item
        const cartItemsWithDiscounts = cartItems
            .filter((product): product is NonNullable<typeof product> => product !== null)
            .map((product) => {
                if (typeof product.price === 'number') {
                    let finalPrice = product.price;
                    let discountAmount = 0;
                    let isDiscounted = false;
                    
                    if (product.discount?.isActive) {
                        const now = new Date();
                        const startDate = new Date(product.discount.startDate);
                        const endDate = new Date(product.discount.endDate);
                        
                        if (now >= startDate && now <= endDate) {
                            if (product.discount.discountType === "percentage") {
                                discountAmount = (product.price * product.discount.discount) / 100;
                                finalPrice = product.price - discountAmount;
                                isDiscounted = true;
                            } else if (product.discount.discountType === "fixed") {
                                discountAmount = product.discount.discount;
                                finalPrice = Math.max(0, product.price - discountAmount);
                                isDiscounted = true;
                            }
                        }
                    }
                    
                    return {
                        ...product,
                        finalPrice,
                        discountAmount,
                        isDiscounted
                    };
                }
                return product;
            });

        // Calculate totals with discounted prices
        const totalItems = cartItemsWithDiscounts.length;
        const totalPrice = cartItemsWithDiscounts.reduce((total: number, product) => {
            if (product && typeof product.price === 'number') {
                // Use the finalPrice we calculated above
                const finalPrice = (product as { finalPrice?: number }).finalPrice || product.price;
                return total + finalPrice;
            }
            return total;
        }, 0);

        return NextResponse.json({
            cartItems: cartItemsWithDiscounts,
            totalItems,
            totalPrice
        });

    } catch (error) {
        console.error('Error fetching user cart:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, productId } = body;

        if (!userId || !productId) {
            return NextResponse.json(
                { error: 'User ID and Product ID are required' },
                { status: 400 }
            );
        }

        // Check if product exists
        const product = await serverClient.getDocument(productId);
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Get current user
        const user = await serverClient.getDocument(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if product is already in cart
        const existingCart = user.cart || [];
        const isAlreadyInCart = existingCart.some((item: CartItem) => item._ref === productId);

        if (isAlreadyInCart) {
            return NextResponse.json(
                { error: 'Product already in cart' },
                { status: 400 }
            );
        }

        // Add product to cart
        const updatedCart = [
            ...existingCart,
            {
                _type: 'reference',
                _ref: productId
            }
        ];

        // Update user's cart
        await serverClient.patch(userId)
            .set({ cart: updatedCart })
            .commit();

        return NextResponse.json({
            success: true,
            message: 'Product added to cart successfully',
            cartItems: updatedCart
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Update cart (replace entire cart)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, cartItems } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Validate cart items
        if (!Array.isArray(cartItems)) {
            return NextResponse.json(
                { error: 'Cart items must be an array' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await serverClient.getDocument(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update user's cart
        await serverClient.patch(userId)
            .set({ cart: cartItems })
            .commit();

        return NextResponse.json({
            success: true,
            message: 'Cart updated successfully',
            cartItems
        });

    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const productId = searchParams.get('productId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get current user
        const user = await serverClient.getDocument(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const currentCart = user.cart || [];

        if (productId) {
            // Remove specific product
            const updatedCart = currentCart.filter((item: CartItem) => item._ref !== productId);
            
            await serverClient.patch(userId)
                .set({ cart: updatedCart })
                .commit();

            return NextResponse.json({
                success: true,
                message: 'Product removed from cart successfully',
                cartItems: updatedCart
            });
        } else {
            // Clear entire cart
            await serverClient.patch(userId)
                .set({ cart: [] })
                .commit();

            return NextResponse.json({
                success: true,
                message: 'Cart cleared successfully',
                cartItems: []
            });
        }

    } catch (error) {
        console.error('Error removing from cart:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
