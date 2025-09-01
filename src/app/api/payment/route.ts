import Stripe from 'stripe';

import { NextRequest, NextResponse } from 'next/server';


// Initialize Stripe with your secret key (server-only)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// POST - Create payment intent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = 'usd',
      orderId,
      customerEmail,
      customerName,
      metadata = {}
    } = body;

    // Validate required fields
    if (!amount || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, customerEmail' },
        { status: 400 }
      );
    }

    // Validate amount (must be in cents and positive)
    const amountInCents = Math.round(amount * 100);
    if (amountInCents <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be greater than 0.' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId || 'temp-order',
        customerEmail,
        customerName: customerName || '',
        ...metadata
      },
      receipt_email: customerEmail,
      description: `Payment for order ${orderId || 'temp-order'}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountInCents,
      currency: paymentIntent.currency,
    });

  } catch (error: unknown) {
    console.error('Error creating payment intent:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve payment intent status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
      created: paymentIntent.created,
    });

  } catch (error: unknown) {
    console.error('Error retrieving payment intent:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
