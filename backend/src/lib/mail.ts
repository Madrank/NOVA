import { mkdir, appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const logsDir = fileURLToPath(new URL('../../logs', import.meta.url));

async function logMail(message: MailMessage): Promise<void> {
  const block = [
    `[EMAIL][${new Date().toISOString()}]`,
    `To: ${message.to}`,
    `Subject: ${message.subject}`,
    '',
    message.text,
    message.html ? `(html: ${message.html.length} octets)` : '',
    '========================================',
    '',
  ].join('\n');
  console.log(`[mail] ${block}`);
  try {
    await mkdir(logsDir, { recursive: true });
    await appendFile(join(logsDir, 'mail.log'), block + '\n', 'utf8');
  } catch (err) {
    console.error('[mail] impossible d’écrire le fichier de log :', err);
  }
}

async function sendSmtp(message: MailMessage): Promise<void> {
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
  await transporter.sendMail({
    from: env.smtp.from,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}

export async function sendMail(message: MailMessage): Promise<void> {
  if (env.mailDriver === 'smtp' && env.smtp.host) {
    await sendSmtp(message);
    return;
  }
  await logMail(message);
}