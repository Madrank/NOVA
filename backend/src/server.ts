import { app } from './app.js';
import { env } from './config/env.js';
import { checkDatabase, pool } from './db/pool.js';

async function start(): Promise<void> {
  await checkDatabase();
  console.log(`[db] PostgreSQL accessible`);
  app.listen(env.port, () => {
    console.log(`[api] NOVA backend démarré sur http://localhost:${env.port} (${env.nodeEnv})`);
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