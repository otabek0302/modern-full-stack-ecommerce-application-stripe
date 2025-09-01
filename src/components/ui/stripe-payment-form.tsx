"use client";

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentFormProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerName?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

interface PaymentFormProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerName?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

function PaymentForm({ 
  amount, 
  orderId, 
  customerEmail, 
  customerName, 
  onSuccess, 
  onError, 
  onCancel 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First create the order in our system
      const orderResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: customerEmail, // We'll use email as user identifier for now
          cartItems: [], // This will be handled by the main checkout form
          shippingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          },
          paymentMethod: 'stripe',
          totalPrice: amount,
          subtotal: amount,
          shipping: 0,
          orderNotes: '',
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderResult = await orderResponse.json();
      const createdOrderId = orderResult.orderId;

      // Now create payment intent with the order ID
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderId: createdOrderId,
          customerEmail,
          customerName,
          currency: 'usd',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
      // Store the order ID for success callback
      setCreatedOrderId(createdOrderId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/profile/orders/${orderId}?payment=success`,
        },
      });

      if (confirmError) {
        throw confirmError;
      }

      // Payment successful
      onSuccess(clientSecret);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !clientSecret) {
    return (
      <Card className="border border-gray-200 rounded-lg shadow-none">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-gray-600">Setting up payment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !clientSecret) {
    return (
      <Card className="border border-gray-200 rounded-lg shadow-none">
        <CardContent className="p-8">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button onClick={createPaymentIntent} variant="outline">
              Try Again
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 rounded-lg shadow-none">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Payment Details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Total:</span>
              <span className="font-semibold text-lg">${amount.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500">
              Order ID: {orderId}
            </div>
          </div>

          {/* Payment Element */}
          {clientSecret && (
            <div className="space-y-4">
              <PaymentElement 
                options={{
                  layout: 'tabs',
                  defaultValues: {
                    billingDetails: {
                      email: customerEmail,
                      name: customerName || '',
                    },
                  },
                }}
              />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!stripe || !elements || isLoading}
              className="flex-1"
            >
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
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center">
            🔒 Your payment information is secure and encrypted by Stripe
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
