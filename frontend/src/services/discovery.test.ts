import { describe, expect, it } from 'vitest';
import { priceBounds, searchServices } from './discovery';

describe('searchServices', () => {
  it('retourne tous les services sans filtre', async () => {
    const { items, total } = await searchServices({});
    expect(total).toBe(12);
    expect(items.length).toBe(total);
  });

  it('filtre par catégorie', async () => {
    const { items, total } = await searchServices({ category: 'massage' });
    expect(total).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.category).toBe('massage');
    }
  });

  it('recherche insensible aux accents', async () => {
    const { items } = await searchServices({ query: 'eclat' });
    expect(items.length).toBeGreaterThan(0);
    const normalized = (value: string) =>
      value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    for (const item of items) {
      const haystack = normalized(`${item.name} ${item.summary} ${item.professionalName}`);
      expect(haystack).toContain('eclat');
    }
  });

  it('filtre par prix minimum', async () => {
    const { items } = await searchServices({ minPrice: 200 });
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.price).toBeGreaterThanOrEqual(200);
    }
  });

  it('borne le prix maximum', async () => {
    const { items } = await searchServices({ maxPrice: priceBounds.max - 1 });
    for (const item of items) {
      expect(item.price).toBeLessThanOrEqual(priceBounds.max - 1);
    }
  });

  it('trie par prix croissant', async () => {
    const { items } = await searchServices({ sort: 'price-asc' });
    for (let i = 1; i < items.length; i++) {
      expect(items[i].price).toBeGreaterThanOrEqual(items[i - 1].price);
    }
  });

  it('combine catégorie et recherche', async () => {
    const { items } = await searchServices({ category: 'spa', query: 'escape' });
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.category).toBe('spa');
    }
  });
});