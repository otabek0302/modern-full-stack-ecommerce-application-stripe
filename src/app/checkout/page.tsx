"use client";

import React, { useState } from "react";
import { useStateContext } from "@/contexts/state-context";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CheckoutForm from "@/components/sections/checkout/checkout-form";
import CheckoutOrderSummary from "@/components/sections/checkout/checkout-order-summary";
import { getDiscountedPrice } from "@/lib/products.utils";

export default function CheckoutPage() {
    const { cartItems, onRemoveFromCart, clearCart } = useStateContext();
    const { user, isAuthenticated } = useUserContext();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if no items in cart or user not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/sign-in");
            return;
        }

        if (!cartItems || cartItems.length === 0) {
            router.push("/profile/cart");
            return;
        }
    }, [isAuthenticated, cartItems, router]);

    // Handle form submission
    const handleFormSubmit = async (formData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        orderNotes: string;
        paymentMethod: string;
        shipToDifferentAddress: boolean;
        shippingAddress: {
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
        cardNumber: string;
        cardName: string;
        cardExpiry: string;
        cardCvv: string;
    }) => {
        setIsSubmitting(true);

        try {
            // Calculate totals
            const subtotal = cartItems.reduce((total, item) => {
                const discountedPrice = getDiscountedPrice(item.product);
                return total + (discountedPrice * item.quantity);
            }, 0);

            const shipping = subtotal > 50 ? 0 : 5.99;
            const totalPrice = subtotal + shipping;

            // Create order data matching the API schema
            const orderData = {
                user: user?._id || user,
                cartItems: cartItems,
                shippingAddress: {
                    street: formData.shippingAddress.street,
                    city: formData.shippingAddress.city,
                    state: formData.shippingAddress.state,
                    zipCode: formData.shippingAddress.zipCode,
                    country: formData.shippingAddress.country,
                },
                paymentMethod: formData.paymentMethod === "stripe" ? "stripe" : formData.paymentMethod,
                totalPrice,
                subtotal,
                shipping,
                orderNotes: formData.orderNotes,
            };



            // Call the checkout API
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create order');
            }

            const result = await response.json();


            // Clear cart after successful order (both local and server)
            clearCart();
            
            // Also clear cart on server if user is authenticated
            if (user?._id) {
                try {
                    await fetch(`/api/user/cart?userId=${user._id}`, {
                        method: 'DELETE'
                    });
                } catch (error) {
                    console.error('Error clearing server cart:', error);
                }
            }

            // Redirect to orders page
            router.push("/profile/orders");
        } catch (error) {
            console.error("Error placing order:", error);
            alert(`Error placing order: ${error instanceof Error ? error.message : 'Please try again.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading while checking authentication
    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    // Show empty cart message
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-gray-400 text-2xl">🛒</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add some products to your cart to continue with checkout.</p>
                    <button onClick={() => router.push("/products")} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                <p className="text-gray-600">Complete your order and secure your purchase</p>
            </div>

            {/* Checkout Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form - Takes 2/3 of the space */}
                <div className="lg:col-span-2">
                    <CheckoutForm user={user} onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
                </div>

                {/* Order Summary - Takes 1/3 of the space */}
                <div className="lg:col-span-1">
                    <CheckoutOrderSummary cartItems={cartItems} />
                </div>
            </div>
        </div>
    );
}
