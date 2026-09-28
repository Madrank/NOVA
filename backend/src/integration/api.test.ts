import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../app.js';

const SERVICE_SLUG = 'soin-visage-rose-de-minuit';
const PRO_EMAIL = 'estelle.demo@nova.fr';
const PRO_PASSWORD = 'secret123';
const ADMIN_EMAIL = 'admin@nova.fr';
const ADMIN_PASSWORD = 'admin123';

const stamp = Date.now().toString(36);
const client = {
  firstName: 'Vitest',
  lastName: 'Nova',
  email: `vitest-${stamp}@nova.fr`,
  password: 'secret123',
};

function dateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
const tomorrowKey = dateKey(tomorrow);
// Créneau ciblé en heure LOCALE serveur : converti en ISO pour matcher l'API.
const slotStartIso = new Date(`${tomorrowKey}T13:00:00`).toISOString();

let proToken = '';
let clientToken = '';
let adminToken = '';
let adminUserId = '';
let serviceId = '';

describe('API NOVA — intégration', () => {
  it('santé', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it("inscription d'un client + login", async () => {
    const register = await request(app)
      .post('/api/auth/register')
      .send(client)
      .expect(201);
    expect(register.body.user.email).toBe(client.email);
    expect(register.body.token).toBeTruthy();

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: client.email, password: client.password })
      .expect(200);
    expect(login.body.token).toBeTruthy();
    clientToken = login.body.token;
  });

  it('login professionnel (Estelle)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: PRO_EMAIL, password: PRO_PASSWORD })
      .expect(200);
    expect(res.body.user.role).toBe('professional');
    proToken = res.body.token;
  });

  it('login administrateur', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .expect(200);
    expect(res.body.user.role).toBe('admin');
    adminToken = res.body.token;

    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${adminToken}`).expect(200);
    adminUserId = me.body.user.id;
  });

  it('catalogue public : services, professionnels, établissements', async () => {
    const services = await request(app).get('/api/services').expect(200);
    expect(services.body.services.length).toBeGreaterThan(0);

    const found = services.body.services.find((s: { slug: string }) => s.slug === SERVICE_SLUG);
    expect(found).toBeTruthy();
    serviceId = found.id;

    const professionals = await request(app).get('/api/professionals').expect(200);
    expect(professionals.body.professionals.length).toBeGreaterThan(0);

    const establishments = await request(app).get('/api/establishments').expect(200);
    expect(establishments.body.establishments.length).toBeGreaterThan(0);
  });

  it('disponibilités du service', async () => {
    const res = await request(app).get(`/api/services/${SERVICE_SLUG}/availability`).expect(200);
    expect(Array.isArray(res.body.slots)).toBe(true);
  });

  it("création d'un créneau par le professionnel", async () => {
    const res = await request(app)
      .post('/api/professionals/me/availability')
      .set('Authorization', `Bearer ${proToken}`)
      .send({
        serviceIds: [serviceId],
        days: [tomorrowKey],
        ranges: [{ from: '13:00', to: '15:30' }],
      })
      .expect(201);
    // Peut valoir 0 si le créneau existe déjà (ON CONFLICT DO NOTHING) ;
    // le flux de réservation ci-dessous reste validé sur le créneau présent.
    expect(res.body.created).toBeGreaterThanOrEqual(0);
  });

  it('réservation → paiement démo → confirmation → annulation → notifications', async () => {
    const availability = await request(app).get(`/api/services/${SERVICE_SLUG}/availability`).expect(200);
    const slot = availability.body.slots.find(
      (s: { startsAt: string }) => s.startsAt.slice(0, 16) === slotStartIso.slice(0, 16),
    );
    expect(slot).toBeTruthy();

    const created = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ serviceSlug: SERVICE_SLUG, availabilityId: slot.id })
      .expect(201);
    const bookingId = created.body.booking.id;
    expect(created.body.booking.status).toBe('pending');
    expect(created.body.booking.price).toBeGreaterThan(0);

    const paid = await request(app)
      .post(`/api/bookings/${bookingId}/pay`)
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(200);
    expect(paid.body.booking.status).toBe('confirmed');

    const cancelled = await request(app)
      .post(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ reason: 'Test d’intégration' })
      .expect(200);
    expect(cancelled.body.booking.status).toBe('cancelled');

    const unread = await request(app)
      .get('/api/notifications/unread-count')
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(200);
    expect(unread.body.unreadCount).toBeGreaterThan(0);
  });

  it('tableau de bord professionnel', async () => {
    const res = await request(app)
      .get('/api/professionals/me/dashboard')
      .set('Authorization', `Bearer ${proToken}`)
      .expect(200);
    expect(res.body).toHaveProperty('upcoming');
    expect(res.body).toHaveProperty('completed');
    expect(res.body).toHaveProperty('appointments');
    expect(Array.isArray(res.body.appointments)).toBe(true);
  });

  it('back-office admin : vue d’ensemble et listes', async () => {
    const auth = (r: request.Test) => r.set('Authorization', `Bearer ${adminToken}`);

    const overview = await auth(request(app).get('/api/admin/overview')).expect(200);
    expect(overview.body.users.total).toBeGreaterThan(0);

    const users = await auth(request(app).get('/api/admin/users')).expect(200);
    expect(Array.isArray(users.body)).toBe(true);
    expect(users.body.length).toBeGreaterThan(0);

    const bookings = await auth(request(app).get('/api/admin/bookings')).expect(200);
    expect(Array.isArray(bookings.body)).toBe(true);

    const services = await auth(request(app).get('/api/admin/services')).expect(200);
    expect(Array.isArray(services.body)).toBe(true);
    expect(services.body.length).toBeGreaterThan(0);
  });

  it('admin : changement de rôle d’un utilisateur (aller-retour)', async () => {
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${clientToken}`).expect(200);
    const clientUserId = me.body.user.id;

    const up = await request(app)
      .patch(`/api/admin/users/${clientUserId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'professional' })
      .expect(200);
    expect(up.body.role).toBe('professional');

    const down = await request(app)
      .patch(`/api/admin/users/${clientUserId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'client' })
      .expect(200);
    expect(down.body.role).toBe('client');
  });

  it('admin : auto-modification de rôle refusée', async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${adminUserId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'client' })
      .expect(400);
    expect(res.body.error.code).toBe('SELF_ROLE_CHANGE');
  });

  it('admin : accès refusé sans rôle admin', async () => {
    await request(app).get('/api/admin/overview').expect(401);
    await request(app)
      .get('/api/admin/overview')
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(403);
  });
});