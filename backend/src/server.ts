import { app } from './app.js';
import { env } from './config/env.js';
import { checkDatabase, pool } from './db/pool.js';
import { runBookingReminders } from './services/notifications.js';

function scheduleReminders(): void {
  const intervalMs = Math.max(Number(process.env.REMINDER_INTERVAL_MIN ?? 15), 1) * 60 * 1000;
  const run = (): void => {
    runBookingReminders().catch((err) => {
      console.error('[notif] échec du rappel de rendez-vous :', err instanceof Error ? err.message : err);
    });
  };
  run();
  setInterval(run, intervalMs);
}

async function start(): Promise<void> {
  await checkDatabase();
  console.log(`[db] PostgreSQL accessible`);
  app.listen(env.port, () => {
    console.log(`[api] NOVA backend démarré sur http://localhost:${env.port} (${env.nodeEnv})`);
    scheduleReminders();
  });
}

function shutdown(signal: string): void {
  console.log(`[api] ${signal} reçu, arrêt en cours…`);
  pool.end().then(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start().catch((err) => {
  console.error('[api] Échec du démarrage :', err instanceof Error ? err.message : err);
  process.exit(1);
});