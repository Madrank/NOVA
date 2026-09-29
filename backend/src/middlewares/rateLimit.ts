import type { Request } from 'express';
import { rateLimit } from 'express-rate-limit';

const shared = {
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  message: { error: { code: 'RATE_LIMITED', message: 'Trop de requêtes. Réessayez dans un instant.' } },
};

/**
 * Limiteur général : protège toute l'API (300 req / 15 min / IP).
 * Les webhooks Stripe sont exclus : leurs adresses IP varient et la
 * signature de la requête apporte déjà l'authentification.
 */
export const baseLimiter = rateLimit({
  ...shared,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  skip: (req: Request) => {
    const { path } = req;
    return path === '/health' || path.startsWith('/api/webhooks');
  },
});

/** Limiteur resserré sur l'authentification : limite la force brute (30 req / 15 min). */
export const authLimiter = rateLimit({
  ...shared,
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: {
    error: { code: 'RATE_LIMITED', message: 'Trop de tentatives de connexion. Réessayez plus tard.' },
  },
});

/** Limiteur sur les actions payantes/lourdes de réservation (30 req / min). */
export const bookingLimiter = rateLimit({
  ...shared,
  windowMs: 60 * 1000,
  limit: 30,
});