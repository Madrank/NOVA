import type { Request, Response } from 'express';
import type Stripe from 'stripe';
import { env } from '../config/env.js';
import { stripeClient } from '../lib/stripe.js';
import { failBooking, verifyAndConfirmPayment } from '../services/payments.js';
import { findBookingByProviderRef } from '../repositories/payments.js';

export async function stripeWebhookController(req: Request, res: Response): Promise<void> {
  const stripe = stripeClient();
  if (!stripe) {
    res.status(200).json({ received: true, demo: true });
    return;
  }

  const signature = req.headers['stripe-signature'] as string | undefined;
  if (!signature) {
    res.status(400).json({ error: { code: 'INVALID_SIGNATURE', message: 'Signature manquante' } });
    return;
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
  } catch {
    res.status(400).json({ error: { code: 'INVALID_SIGNATURE', message: 'Signature invalide' } });
    return;
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const bookingId = intent.metadata?.booking_id;
  if (!bookingId) {
    res.status(200).json({ received: true });
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      await verifyAndConfirmPayment(bookingId);
      break;
    case 'payment_intent.payment_failed':
    case 'payment_intent.canceled': {
      const payment = await findBookingByProviderRef(intent.id);
      if (payment) {
        await failBooking(payment.booking_id, payment.id, 'Paiement échoué');
      }
      break;
    }
    default:
      break;
  }

  res.status(200).json({ received: true });
}