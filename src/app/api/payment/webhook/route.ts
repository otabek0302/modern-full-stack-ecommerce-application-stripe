import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { serverClient } from '@/lib/sanity.server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: unknown) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
            // Webhook event received
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;
      
      default:
        // Unhandled event type
    }

    return NextResponse.json({ received: true });

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId as string | undefined;
    
    // Payment intent succeeded
    
    // If we don't have an orderId, create the order now from metadata
    if (!orderId) {
      await createOrderFromPaymentIntent(paymentIntent);
      return;
    }

    // Check if order exists before updating
    const existingOrder = await serverClient.getDocument(orderId);
    if (!existingOrder) {
      console.error(`Order ${orderId} not found in database`);
      return;
    }

    // Updating order payment status to paid

    // Update order status in Sanity
    await serverClient.patch(orderId)
      .set({
        paymentStatus: 'paid',
        status: 'processing',
        updatedAt: new Date().toISOString(),
        stripePaymentIntentId: paymentIntent.id,
        paymentMethod: 'stripe',
        paymentDetails: {
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          paymentMethod: paymentIntent.payment_method_types[0] || 'card',
          receiptUrl: null, 
        }
      })
      .commit();

    // Order payment successful
  } catch (error: unknown) {
    console.error('Error updating order after payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // Update order status in Sanity
    await serverClient.patch(orderId)
      .set({
        paymentStatus: 'failed',
        status: 'payment_failed',
        updatedAt: new Date().toISOString(),
        stripePaymentIntentId: paymentIntent.id,
        paymentError: paymentIntent.last_payment_error?.message || 'Payment failed'
      })
      .commit();

    // Order payment failed
  } catch (error: unknown) {
    console.error('Error updating order after payment failure:', error);
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      console.error('No orderId in payment intent metadata');
      return;
    }

    // Update order status in Sanity
    await serverClient.patch(orderId)
      .set({
        paymentStatus: 'canceled',
        status: 'canceled',
        updatedAt: new Date().toISOString(),
        stripePaymentIntentId: paymentIntent.id
      })
      .commit();

    // Order payment canceled
  } catch (error: unknown) {
    console.error('Error updating order after payment cancellation:', error);
  }
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  try {
    const paymentIntentId = charge.payment_intent as string;
    
    if (!paymentIntentId) {
      console.error('No payment intent ID in charge');
      return;
    }

    // Find order by payment intent ID and update with receipt URL
    const orders = await serverClient.fetch(
      `*[_type == "order" && stripePaymentIntentId == $paymentIntentId]`,
      { paymentIntentId }
    );

    if (orders.length > 0) {
      const order = orders[0];
      await serverClient.patch(order._id)
        .set({
          'paymentDetails.receiptUrl': charge.receipt_url,
          updatedAt: new Date().toISOString(),
        })
        .commit();

      // Order updated with receipt URL
    }
  } catch (error: unknown) {
    console.error('Error updating order with charge details:', error);
  }
}

// Create an order document in Sanity from payment intent metadata
async function createOrderFromPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  try {
    const meta = paymentIntent.metadata || {};
    const userId = (meta.userId as string) || '';
    const shippingAddress = safeJsonParse(meta.shippingAddress);
    const cart = (safeJsonParse(meta.cart) as Array<{ productId: string; quantity: number }>) || [];

    if (!userId || cart.length === 0) {
      console.error('Insufficient metadata to create order', { userId, cartLen: cart.length });
      return;
    }

    // Build order document
    const orderDoc = {
      _type: 'order',
      user: { _type: 'reference', _ref: userId },
      products: cart.map((c, index) => ({ _type: 'reference', _ref: c.productId, _key: `product_${index}_${c.productId}` })),
      notes: '',
      shippingAddress: shippingAddress || undefined,
      paymentMethod: 'stripe',
      paymentStatus: 'paid',
      totalPrice: (paymentIntent.amount || 0) / 100,
      subtotal: (paymentIntent.amount || 0) / 100,
      shipping: 0,
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stripePaymentIntentId: paymentIntent.id,
      paymentDetails: {
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method_types[0] || 'card',
        receiptUrl: null,
      },
    };

    const created = await serverClient.create(orderDoc);

    // Attach order to user document (best effort)
    try {
      const userDoc = await serverClient.getDocument(userId);
      if (userDoc) {
        const existingOrders = userDoc.orders || [];
        await serverClient
          .patch(userId)
          .set({ orders: [...existingOrders, { _type: 'reference', _ref: created._id }] })
          .commit();
      }
    } catch {
      // Failed linking order to user - non-critical error
    }

    // Decrement stock (best effort)
    try {
      await Promise.all(
        cart.map(async (c) => {
          const product = await serverClient.getDocument(c.productId);
          if (product && typeof product.stockQuantity === 'number') {
            const newStock = Math.max(0, product.stockQuantity - (c.quantity || 1));
            await serverClient.patch(c.productId).set({ stockQuantity: newStock }).commit();
          }
        })
      );
    } catch {
      // Failed updating stock quantities - non-critical error
    }

    // Order created from payment intent
  } catch (error) {
    console.error('Error creating order from payment intent', error);
  }
}

function safeJsonParse(value: unknown) {
  try {
    if (!value || typeof value !== 'string') return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
}
