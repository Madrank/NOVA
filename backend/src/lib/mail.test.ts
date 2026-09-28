import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { sendMail } from './mail.js';

const logsDir = fileURLToPath(new URL('../../logs', import.meta.url));

describe('mail', () => {
  it('écrit un email dans logs/mail.log avec le driver log', async () => {
    const marker = `vitest sujet ${Date.now()}`;
    await sendMail({ to: 'destinataire@nova.fr', subject: marker, text: 'Corps du message de test.' });
    const content = await readFile(join(logsDir, 'mail.log'), 'utf8');
    expect(content).toContain(marker);
    expect(content).toContain('To: destinataire@nova.fr');
    expect(content).toContain('Corps du message de test.');
  });
});