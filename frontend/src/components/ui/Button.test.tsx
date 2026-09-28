import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from './Button';

describe('Button', () => {
  it('rend un bouton par défaut', () => {
    render(<Button>Valider</Button>);
    expect(screen.getByRole('button', { name: 'Valider' })).toBeInTheDocument();
  });

  it('rend un lien interne via prop to', () => {
    render(
      <MemoryRouter>
        <Button to="/experiences">Expériences</Button>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: 'Expériences' });
    expect(link).toHaveAttribute('href', '/experiences');
  });

  it('rend un lien d’ancre via prop hash', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Button hash="categories">Découvrir</Button>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: 'Découvrir' });
    expect(link).toHaveAttribute('href', '#categories');
  });

  it('rend un lien externe via prop href', () => {
    render(<Button href="https://exemple.fr">Externe</Button>);
    const link = screen.getByRole('link', { name: 'Externe' });
    expect(link).toHaveAttribute('href', 'https://exemple.fr');
  });

  it('applique les variantes de style', () => {
    render(<Button variant="ghost" size="lg">Test</Button>);
    const button = screen.getByRole('button', { name: 'Test' });
    expect(button.className).toContain('bg-transparent');
    expect(button.className).toContain('py-4');
  });
});