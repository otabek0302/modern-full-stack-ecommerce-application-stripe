import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/sanity.server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user, cartItems, shippingAddress, paymentMethod, totalPrice, subtotal, shipping, orderNotes, stripePaymentIntentId, paymentStatus, status } = body;


        // Validate required fields
        if (!user || !cartItems || !paymentMethod || !totalPrice) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate cart items
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return NextResponse.json(
                { error: 'Cart items are required and must be an array' },
                { status: 400 }
            );
        }

        // Validate each cart item
        for (const item of cartItems) {
            if (!item.product || !item.product._id || !item.quantity || item.quantity <= 0) {
                return NextResponse.json(
                    { error: 'Invalid cart item structure. Each item must have product and quantity.' },
                    { status: 400 }
                );
            }
        }

        // Validate shipping address if ship to different address is enabled
        if (shippingAddress) {
            const requiredShippingFields = ['street', 'city', 'state', 'zipCode', 'country'];
            for (const field of requiredShippingFields) {
                if (!shippingAddress[field]) {
                    return NextResponse.json(
                        { error: `Missing required shipping address field: ${field}` },
                        { status: 400 }
                    );
                }
            }
        }

        // Validate payment method
        const validPaymentMethods = ['cash', 'card', 'stripe'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return NextResponse.json(
                { error: 'Invalid payment method' },
                { status: 400 }
            );
        }

        // Extract product IDs and quantities from cart items
        const products = cartItems.map((item: { product: { _id: string }, quantity: number }) => ({
            productId: item.product._id,
            quantity: item.quantity
        }));

        // Check stock availability before creating order
        const stockCheckPromises = products.map(async ({ productId, quantity }) => {
            const product = await serverClient.getDocument(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            
            if (product.stockQuantity < quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}. Available: ${product.stockQuantity}, Requested: ${quantity}`);
            }
            
            return { productId, quantity, currentStock: product.stockQuantity };
        });

        const stockCheckResults = await Promise.all(stockCheckPromises);

        // Create order document
        const orderDoc = {
            _type: 'order',
            user: {
                _type: 'reference',
                _ref: typeof user === 'string' ? user : user._id
            },
            products: products.map((product: { productId: string }, index: number) => ({
                _type: 'reference',
                _ref: product.productId,
                _key: `product_${index}_${product.productId}`
            })),
            notes: orderNotes || '',
            shippingAddress: shippingAddress || undefined,
            paymentMethod,
            paymentStatus: paymentStatus || (paymentMethod === 'stripe' ? 'pending' : 'pending'),
            totalPrice,
            subtotal: subtotal || totalPrice,
            shipping: shipping || 0,
            status: status || 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Add Stripe payment details if provided
        if (stripePaymentIntentId) {
            orderDoc.stripePaymentIntentId = stripePaymentIntentId;
            orderDoc.paymentDetails = {
                amount: totalPrice,
                currency: 'usd',
                paymentMethod: 'card',
                receiptUrl: null,
            };
        }

        // Create order in Sanity
        const result = await serverClient.create(orderDoc);

        // Add order to user's orders array
        try {
            const userId = typeof user === 'string' ? user : user._id;
            const userDoc = await serverClient.getDocument(userId);
            
            if (userDoc) {
                const existingOrders = userDoc.orders || [];
                const updatedOrders = [
                    ...existingOrders,
                    {
                        _type: 'reference',
                        _ref: result._id
                    }
                ];

                // Update user's orders array
                await serverClient.patch(userId)
                    .set({ orders: updatedOrders })
                    .commit();
                
                // Order added to user orders array successfully
            }
        } catch (userUpdateError) {
            console.error('Error adding order to user orders array:', userUpdateError);
            // Don't fail the order creation if user update fails
            // The order was created successfully
        }

        // Decrement product quantities after successful order creation
        try {
            const updateStockPromises = stockCheckResults.map(async ({ productId, quantity, currentStock }) => {
                const newStock = currentStock - quantity;
                
                // Update the product with new stock quantity
                await serverClient.patch(productId)
                    .set({ stockQuantity: newStock })
                    .commit();
                
                // Stock updated successfully
            });

            // Wait for all stock updates to complete
            await Promise.all(updateStockPromises);
            
            // All product stock quantities updated successfully
        } catch (stockUpdateError) {
            console.error('Error updating product stock quantities:', stockUpdateError);
            
            // Log the error but don't fail the order creation
            // The order was already created successfully
            // In a production environment, you might want to implement a retry mechanism
            // or queue these updates for later processing
            
            return NextResponse.json({
                success: true,
                orderId: result._id,
                message: 'Order created successfully but stock update failed. Please contact support.',
                warning: 'Stock quantities may not have been updated correctly'
            }, { status: 201 });
        }

        return NextResponse.json({
            success: true,
            orderId: result._id,
            message: 'Order created successfully and stock updated'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating order:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        if (typeof message === 'string' && /unauthorized|auth|token|permission/i.test(message)) {
            return NextResponse.json(
                { error: 'Insufficient permissions to create orders. Add a Sanity token with write access.' },
                { status: 403 }
            );
        }
        // Return specific error messages for stock issues
        if (error instanceof Error && error.message.includes('Insufficient stock')) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
