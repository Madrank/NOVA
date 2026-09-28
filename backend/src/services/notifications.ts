import { env } from '../config/env.js';
import { sendMail } from '../lib/mail.js';
import { getBookingWithPaymentById, expirePendingHolds } from '../repositories/bookings.js';
import {
  countUnreadNotifications,
  findBookingsToRemind,
  findProUserByProfessionalId,
  findUserEmail,
  insertNotification,
  listNotificationsByUser,
  markAllNotificationsRead,
  markNotificationRead,
} from '../repositories/notifications.js';
import type { PublicBookingWithPayment } from '../types/booking.js';
import type { NotificationType, PublicNotification } from '../types/notification.js';

const MAIL_FOOTER = 'NOVA — Bien-être & beauté.\nCet email est envoyé automatiquement : merci de ne pas y répondre.';

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function euros(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

function bookingBody(booking: PublicBookingWithPayment): string {
  const lines = [
    `${booking.service.name} le ${formatDate(booking.startsAt)}`,
    `Établissement : ${booking.establishment?.name ?? '—'} (${booking.establishment?.city ?? '—'})`,
    `Praticien(ne) : ${booking.professional.firstName} ${booking.professional.lastName}`,
    `Durée : ${booking.service.durationMinutes} min`,
    `Prix : ${euros(booking.price)} TTC`,
  ];
  return lines.join('\n');
}

async function notifyUser(
  userId: string,
  type: NotificationType,
  bookingId: string | null,
  title: string,
  body: string,
  link?: string,
): Promise<void> {
  await insertNotification({ userId, bookingId, type, title, body, link });
}

async function safe(task: () => Promise<void>): Promise<void> {
  try {
    await task();
  } catch (err) {
    console.error('[notif] une notification/email a échoué :', err);
  }
}

export async function emitBookingCreated(clientId: string, booking: PublicBookingWithPayment): Promise<void> {
  await safe(async () => {
    const title = 'Réservation en attente de paiement';
    const body = `${booking.service.name} — ${formatDate(booking.startsAt)} · ${euros(booking.price)}`;
    await notifyUser(clientId, 'booking_pending', booking.id, title, body, '/compte');

    const recipient = await findUserEmail(clientId);
    if (!recipient) return;
    await sendMail({
      to: recipient.email,
      subject: `NOVA — « ${booking.service.name} » vous attend : finalisez votre paiement`,
      text: `Bonjour ${recipient.firstName},\n\nVotre réservation est en attente de paiement.\n\n${bookingBody(booking)}\n\nFinalisez le paiement depuis votre espace : ${env.appUrl}/compte\n\n${MAIL_FOOTER}`,
    });
  });
}

export async function emitBookingConfirmed(booking: PublicBookingWithPayment): Promise<void> {
  await safe(async () => {
    const title = 'Réservation confirmée';
    const body = `${booking.service.name} — ${formatDate(booking.startsAt)} · ${euros(booking.price)}`;
    await notifyUser(booking.clientId, 'booking_confirmed', booking.id, title, body, '/compte');

    const client = await findUserEmail(booking.clientId);
    if (client) {
      await sendMail({
        to: client.email,
        subject: `NOVA — Votre réservation « ${booking.service.name} » est confirmée`,
        text: `Bonjour ${client.firstName},\n\nVotre réservation est bien confirmée.\n\n${bookingBody(booking)}\n\nNous vous attendons. ${env.appUrl}/compte\n\n${MAIL_FOOTER}`,
      });
    }

    const pro = await findProUserByProfessionalId(booking.professional.id);
    if (pro) {
      await notifyUser(pro.userId, 'booking_confirmed', booking.id, title, body, '/tableau-de-bord');
      await sendMail({
        to: pro.email,
        subject: `NOVA — Nouvelle réservation confirmée : ${booking.service.name}`,
        text: `Bonjour ${pro.firstName},\n\nUne nouvelle réservation vous attend.\n\n${bookingBody(booking)}\nClient(e) enregistré(e) sur votre plateforme. ${env.appUrl}/tableau-de-bord\n\n${MAIL_FOOTER}`,
      });
    }
  });
}

export async function emitBookingCancelled(booking: PublicBookingWithPayment, refunded: boolean): Promise<void> {
  await safe(async () => {
    const title = 'Réservation annulée';
    const body = `${booking.service.name} — ${formatDate(booking.startsAt)}${refunded ? ' · remboursée' : ''}`;
    await notifyUser(booking.clientId, 'booking_cancelled', booking.id, title, body, '/compte');
    if (refunded) {
      await notifyUser(booking.clientId, 'payment_refunded', booking.id, 'Remboursement effectué', `${euros(booking.price)} vous ont été remboursés pour « ${booking.service.name} ».`, '/compte');
    }

    const client = await findUserEmail(booking.clientId);
    if (client) {
      await sendMail({
        to: client.email,
        subject: `NOVA — Votre réservation « ${booking.service.name} » a été annulée`,
        text: `Bonjour ${client.firstName},\n\nVotre réservation suivante a été annulée.\n\n${bookingBody(booking)}${refunded ? '\n\nLe paiement vous a été intégralement remboursé.' : ''}\n\nÀ bientôt. ${env.appUrl}\n\n${MAIL_FOOTER}`,
      });
    }
  });
}

export async function emitBookingExpired(booking: PublicBookingWithPayment): Promise<void> {
  await safe(async () => {
    const title = 'Réservation expirée';
    const body = `${booking.service.name} — le paiement n’a pas abouti, le créneau a été libéré.`;
    await notifyUser(booking.clientId, 'booking_expired', booking.id, title, body, '/compte');

    const client = await findUserEmail(booking.clientId);
    if (client) {
      await sendMail({
        to: client.email,
        subject: `NOVA — Votre réservation « ${booking.service.name} » a expiré`,
        text: `Bonjour ${client.firstName},\n\nLe délai de paiement de votre réservation est dépassé ; le créneau vient d’être libéré.\n\n${bookingBody(booking)}\n\nVous pouvez refaire une réservation quand vous voulez : ${env.appUrl}/experiences\n\n${MAIL_FOOTER}`,
      });
    }
  });
}

export async function emitBookingReminder(booking: PublicBookingWithPayment): Promise<void> {
  await safe(async () => {
    const title = 'Rappel de rendez-vous';
    const body = `${booking.service.name} — demain à ${formatDate(booking.startsAt).split(' à ')[1] ?? ''}`;
    await notifyUser(booking.clientId, 'booking_reminder', booking.id, title, body, '/compte');

    const client = await findUserEmail(booking.clientId);
    if (client) {
      await sendMail({
        to: client.email,
        subject: `NOVA — Rendez-vous demain : ${booking.service.name}`,
        text: `Bonjour ${client.firstName},\n\nPetit rappel de votre rendez-vous de demain.\n\n${bookingBody(booking)}\n\n${MAIL_FOOTER}`,
      });
    }
  });
}

export async function purgeExpiredHoldsAndNotify(holdMinutes: number): Promise<void> {
  const expiredIds = await expirePendingHolds(holdMinutes);
  for (const id of expiredIds) {
    const booking = await getBookingWithPaymentById(id);
    if (booking) {
      await emitBookingExpired(booking);
    }
  }
}

export async function runBookingReminders(): Promise<number> {
  const targets = await findBookingsToRemind();
  for (const target of targets) {
    const booking = await getBookingWithPaymentById(target.id);
    if (booking) {
      await emitBookingReminder(booking);
    }
  }
  return targets.length;
}

export async function listForUser(userId: string, limit: number): Promise<{ notifications: PublicNotification[]; unreadCount: number }> {
  const [notifications, unreadCount] = await Promise.all([
    listNotificationsByUser(userId, limit),
    countUnreadNotifications(userId),
  ]);
  return { notifications, unreadCount };
}

export async function unreadCount(userId: string): Promise<{ unreadCount: number }> {
  return { unreadCount: await countUnreadNotifications(userId) };
}

export async function markRead(userId: string, id: string): Promise<{ ok: boolean }> {
  return { ok: await markNotificationRead(userId, id) };
}

export async function markAllRead(userId: string): Promise<{ read: number }> {
  return { read: await markAllNotificationsRead(userId) };
}