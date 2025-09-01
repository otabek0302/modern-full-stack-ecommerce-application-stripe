import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/sanity.server';

// GET - Fetch user's orders or a specific order
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const orderId = searchParams.get('orderId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // If orderId is provided, fetch specific order
        if (orderId) {
            const order = await serverClient.fetch(`
                *[_type == "order" && _id == $orderId && user._ref == $userId][0] {
                    _id,
                    _createdAt,
                    _updatedAt,
                    user,
                    products[]->{
                        _id,
                        name,
                        price,
                        images[0]
                    },
                    notes,
                    shippingAddress,
                    paymentMethod,
                    paymentStatus,
                    totalPrice,
                    subtotal,
                    shipping,
                    status,
                    createdAt,
                    updatedAt
                }
            `, { orderId, userId });

            if (!order) {
                return NextResponse.json(
                    { error: 'Order not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                order
            });
        }

        // Fetch all orders for the user
        const orders = await serverClient.fetch(`
            *[_type == "order" && user._ref == $userId] | order(createdAt desc) {
                _id,
                _createdAt,
                _updatedAt,
                user,
                products[]->{
                    _id,
                    name,
                    price,
                    images[0]
                },
                notes,
                shippingAddress,
                paymentMethod,
                paymentStatus,
                totalPrice,
                subtotal,
                shipping,
                status,
                createdAt,
                updatedAt
            }
        `, { userId });

        return NextResponse.json({
            orders: orders || [],
            totalOrders: orders?.length || 0
        });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
