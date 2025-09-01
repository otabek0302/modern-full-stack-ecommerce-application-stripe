import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/sanity.server';

interface WishlistItem {
    _type: 'reference';
    _ref: string;
}

// GET - Fetch user's wishlist
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

        // Fetch user with populated wishlist items
        const user = await serverClient.getDocument(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // If no wishlist items, return empty array
        if (!user.wishlist || user.wishlist.length === 0) {
            return NextResponse.json({
                wishlistItems: [],
                totalItems: 0
            });
        }

        // Fetch wishlist items with product details
        const wishlistItems = await serverClient.getDocuments(
            user.wishlist.map((item: WishlistItem) => item._ref)
        );

        return NextResponse.json({
            wishlistItems,
            totalItems: wishlistItems.length
        });

    } catch (error) {
        console.error('Error fetching user wishlist:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Add item to wishlist
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

        // Check if product is already in wishlist
        const existingWishlist = user.wishlist || [];
        const isAlreadyInWishlist = existingWishlist.some((item: WishlistItem) => item._ref === productId);

        if (isAlreadyInWishlist) {
            return NextResponse.json(
                { error: 'Product already in wishlist' },
                { status: 400 }
            );
        }

        // Add product to wishlist
        const updatedWishlist = [
            ...existingWishlist,
            {
                _type: 'reference',
                _ref: productId
            }
        ];

        // Update user's wishlist
        await serverClient.patch(userId)
            .set({ wishlist: updatedWishlist })
            .commit();

        return NextResponse.json({
            success: true,
            message: 'Product added to wishlist successfully',
            wishlistItems: updatedWishlist
        });

    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from wishlist
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

        const currentWishlist = user.wishlist || [];

        if (productId) {
            // Remove specific product
            const updatedWishlist = currentWishlist.filter((item: WishlistItem) => item._ref !== productId);
            
            await serverClient.patch(userId)
                .set({ wishlist: updatedWishlist })
                .commit();

            return NextResponse.json({
                success: true,
                message: 'Product removed from wishlist successfully',
                wishlistItems: updatedWishlist
            });
        } else {
            // Clear entire wishlist
            await serverClient.patch(userId)
                .set({ wishlist: [] })
                .commit();

            return NextResponse.json({
                success: true,
                message: 'Wishlist cleared successfully',
                wishlistItems: []
            });
        }

    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
