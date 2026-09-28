import { beforeEach, describe, expect, it, vi } from 'vitest';
import { changeUserRole, toggleServiceActive } from './admin.js';

vi.mock('../repositories/admin.js', () => ({
  findServiceRow: vi.fn(),
  findUserRole: vi.fn(),
  getAdminCounters: vi.fn(),
  listAdminBookings: vi.fn(),
  listAdminServices: vi.fn(),
  listAdminUsers: vi.fn(),
  listRecentBookings: vi.fn(),
  setServiceActive: vi.fn(),
  setUserRole: vi.fn(),
}));

import * as repo from '../repositories/admin.js';

describe('services/admin — garanties métier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("interdit la promotion au rôle admin", async () => {
    await expect(changeUserRole('a', 'b', 'admin')).rejects.toMatchObject({
      status: 403,
      code: 'ADMIN_ROLE_PROTECTED',
    });
    expect(repo.setUserRole).not.toHaveBeenCalled();
  });

  it('interdit de modifier son propre rôle', async () => {
    await expect(changeUserRole('1', '1', 'client')).rejects.toMatchObject({
      status: 400,
      code: 'SELF_ROLE_CHANGE',
    });
  });

  it('interdit de modifier un administrateur existant', async () => {
    vi.mocked(repo.findUserRole).mockResolvedValue('admin');
    await expect(changeUserRole('a', 'b', 'client')).rejects.toMatchObject({
      status: 403,
      code: 'ADMIN_ROLE_PROTECTED',
    });
  });

  it('rejette une cible inexistante', async () => {
    vi.mocked(repo.findUserRole).mockResolvedValue(null);
    await expect(changeUserRole('a', 'b', 'client')).rejects.toMatchObject({
      status: 404,
      code: 'USER_NOT_FOUND',
    });
  });

  it('change un rôle valide et retourne la mise à jour', async () => {
    vi.mocked(repo.findUserRole).mockResolvedValue('professional');
    const result = await changeUserRole('actor', 'target', 'client');
    expect(result).toEqual({ id: 'target', role: 'client' });
    expect(repo.setUserRole).toHaveBeenCalledWith('target', 'client');
  });

  it('refuse un service inconnu', async () => {
    vi.mocked(repo.findServiceRow).mockResolvedValue(null);
    await expect(toggleServiceActive('abc', true)).rejects.toMatchObject({
      status: 404,
      code: 'SERVICE_NOT_FOUND',
    });
  });

  it('active/désactive un service connu', async () => {
    vi.mocked(repo.findServiceRow).mockResolvedValue({ id: 'srv', is_active: false });
    const result = await toggleServiceActive('srv', true);
    expect(result).toEqual({ id: 'srv', active: true });
    expect(repo.setServiceActive).toHaveBeenCalledWith('srv', true);
  });
});