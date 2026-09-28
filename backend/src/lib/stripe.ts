import Stripe from 'stripe';
import { env, isProd } from '../config/env.js';

const STRIPE_API_VERSION = '2025-09-08.acacia';

export function stripeClient(): Stripe | null {
  if (!env.stripeSecretKey) {
    return null;
  }
  return new Stripe(env.stripeSecretKey, {
    apiVersion: STRIPE_API_VERSION as Stripe.StripeConfig['apiVersion'],
  });
}

export interface PaymentConfig {
  demo: boolean;
  publishableKey: string | null;
  currency: string;
  holdMinutes: number;
}

export function paymentConfig(): PaymentConfig {
  const demo = !env.stripeSecretKey;
  return {
    demo,
    publishableKey: demo ? null : env.stripePublishableKey,
    currency: 'eur',
    holdMinutes: isProd ? 15 : 60,
  };
}