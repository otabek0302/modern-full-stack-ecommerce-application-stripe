"use client";

import React, { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, CheckCircle, XCircle } from "lucide-react";
import { ProductType, UserType } from "@/interfaces";

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentSectionProps {
    amount: number;
    customerEmail: string;
    customerName?: string;
    cartItems: { product: ProductType; quantity: number }[];
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    user: UserType;
    onPaymentSuccess: (paymentIntentId: string) => void;
    onPaymentError: (error: string) => void;
    onPaymentCancel: () => void;
}

interface PaymentSectionProps {
    amount: number;
    customerEmail: string;
    customerName?: string;
    cartItems: { product: ProductType; quantity: number }[];
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    user: UserType;
    onPaymentSuccess: (paymentIntentId: string) => void;
    onPaymentError: (error: string) => void;
    onPaymentCancel: () => void;
}

function PaymentSection({ amount, customerEmail, customerName, cartItems, shippingAddress, user, onPaymentSuccess, onPaymentError, onPaymentCancel }: PaymentSectionProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                throw submitError;
            }

            // Confirm payment without redirect
            const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
            });

            if (confirmError) {
                throw confirmError;
            }

            // Check if payment was successful
            if (paymentIntent?.status === "succeeded") {

                
                // Create order immediately after successful payment
                try {
                    const orderResponse = await fetch("/api/checkout", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            user: user?._id || user,
                            cartItems: cartItems,
                            shippingAddress: shippingAddress,
                            paymentMethod: "stripe",
                            totalPrice: amount,
                            subtotal: amount,
                            shipping: 0,
                            orderNotes: "",
                            stripePaymentIntentId: paymentIntent.id,
                            paymentStatus: 'paid',
                            status: 'processing'
                        }),
                    });

                    if (!orderResponse.ok) {
                        const errorData = await orderResponse.json();
                        throw new Error(errorData.error || "Failed to create order");
                    }

                    const orderResult = await orderResponse.json();

                    
                    onPaymentSuccess(paymentIntent.id);
                    // Redirect to orders page after successful payment
                    window.location.href = `/profile/orders?payment=success&payment_intent=${paymentIntent.id}`;
                } catch (orderError) {
                    // Order creation failed after successful payment
                    // Payment succeeded but order creation failed
                    setError("Payment successful but order creation failed. Please contact support.");
                    onPaymentError("Order creation failed after payment");
                }
            } else {
                throw new Error("Payment was not successful");
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Payment failed";
            setError(errorMessage);
            onPaymentError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Total:</span>
                    <span className="font-semibold text-lg">${amount.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Element */}
            <div className="space-y-4">
                <PaymentElement
                    options={{
                        layout: "tabs",
                        defaultValues: {
                            billingDetails: {
                                email: customerEmail,
                                name: customerName || "",
                            },
                        },
                    }}
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <div className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button type="button" onClick={handleSubmit} disabled={!stripe || !elements || isLoading} className="flex-1">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Pay ${amount.toFixed(2)}
                        </div>
                    )}
                </Button>
                <Button type="button" variant="outline" onClick={onPaymentCancel} disabled={isLoading}>
                    Cancel
                </Button>
            </div>

            {/* Security Notice */}
            <div className="text-xs text-gray-500 text-center">🔒 Your payment information is secure and encrypted by Stripe</div>
        </div>
    );
}

export default function StripePaymentSection(props: StripePaymentSectionProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPaymentIntent = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Validate shipping address before creating payment intent
            const requiredFields = ["street", "city", "state", "zipCode", "country"];
            const missingFields = requiredFields.filter((field) => !props.shippingAddress[field as keyof typeof props.shippingAddress]);
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required shipping address field${missingFields.length > 1 ? "s" : ""}: ${missingFields.join(", ")}`);
            }

            // Create payment intent only - order will be created after payment success
            const response = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: props.amount,
                    customerEmail: props.customerEmail,
                    customerName: props.customerName,
                    currency: "usd",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create payment intent");
            }

            setClientSecret(data.clientSecret);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            props.onPaymentError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [props]);

    // Don't auto-create payment intent on mount - only create when user initiates payment
    // useEffect(() => {
    //     // Create payment intent when component mounts
    //     createPaymentIntent();
    // }, [createPaymentIntent]);

    // Show loading state when creating payment intent
    if (isLoading && !clientSecret) {
        return (
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900">Credit Card Payment</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center space-x-2 p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-gray-600">Setting up payment...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Show initial payment setup if no client secret yet
    if (!clientSecret && !isLoading) {
        return (
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900">Credit Card Payment</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Order Total:</span>
                            <span className="font-semibold text-lg">${props.amount.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <Button 
                        onClick={createPaymentIntent}
                        disabled={isLoading}
                        className="w-full flex items-center gap-2"
                    >
                        <CreditCard className="h-4 w-4" />
                        {isLoading ? 'Setting up...' : `Pay $${props.amount.toFixed(2)}`}
                    </Button>
                    
                    <div className="text-xs text-gray-500 text-center">
                        🔒 Your payment information is secure and encrypted by Stripe
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error && !clientSecret) {
        return (
            <Card className="border border-gray-200 rounded-lg shadow-none">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900">Credit Card Payment</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                            <div className="flex items-center space-x-2">
                                <XCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={createPaymentIntent} variant="outline">
                                Try Again
                            </Button>
                            <Button onClick={props.onPaymentCancel} variant="outline">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!clientSecret) {
        return null;
    }

    return (
        <Card className="border border-gray-200 rounded-lg shadow-none">
            <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Credit Card Payment</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentSection {...props} />
                </Elements>
            </CardContent>
        </Card>
    );
}
