import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { establishmentRouter } from './routes/establishments.js';
import { professionalRouter } from './routes/professionals.js';
import { serviceRouter } from './routes/services.js';
import { bookingRouter } from './routes/bookings.js';
import { webhookRouter } from './routes/webhooks.js';
import { paymentsRouter } from './routes/payments.js';
import { notificationRouter } from './routes/notifications.js';
import { adminRouter } from './routes/admin.js';
import { notFound, errorHandler } from './middlewares/error.js';

export const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: env.corsOrigin, credentials: true }));

// Corps brut exigé pour la vérification de signature Stripe : monté avant le parser JSON.
app.use('/api/webhooks', webhookRouter);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/establishments', establishmentRouter);
app.use('/api/professionals', professionalRouter);
app.use('/api/services', serviceRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);