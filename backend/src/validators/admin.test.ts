import { describe, expect, it } from 'vitest';
import { changeUserRoleSchema, setServiceActiveSchema } from './admin.js';

describe('validators admin', () => {
  it('accepte client et professional', () => {
    expect(changeUserRoleSchema.parse({ role: 'client' })).toEqual({ role: 'client' });
    expect(changeUserRoleSchema.parse({ role: 'professional' })).toEqual({ role: 'professional' });
  });

  it("refuse le rôle admin et les valeurs inconnues", () => {
    expect(() => changeUserRoleSchema.parse({ role: 'admin' })).toThrow();
    expect(() => changeUserRoleSchema.parse({ role: 'super' })).toThrow();
  });

  it('exige un booléen pour active', () => {
    expect(setServiceActiveSchema.parse({ active: false })).toEqual({ active: false });
    expect(() => setServiceActiveSchema.parse({ active: 'yes' })).toThrow();
    expect(() => setServiceActiveSchema.parse({})).toThrow();
  });
});