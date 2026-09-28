import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { HashLink } from './HashLink';

function LocationProbe() {
  const location = useLocation();
  return (
    <span data-testid="probe">
      {location.pathname}|{location.hash}
    </span>
  );
}

describe('HashLink', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('scrolle en douceur lorsque l’on est déjà sur la page d’accueil', () => {
    const scrollIntoView = vi.fn();
    const element = { scrollIntoView } as unknown as HTMLElement;
    vi.spyOn(document, 'getElementById').mockReturnValue(element);
    const replaceState = vi.spyOn(window.history, 'replaceState');

    render(
      <MemoryRouter initialEntries={['/']}>
        <HashLink hash="categories">Découvrir</HashLink>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Découvrir' }));
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(replaceState).toHaveBeenCalledWith(null, '', '#categories');
  });

  it('navigue vers /#ancre depuis une autre page', () => {
    render(
      <MemoryRouter initialEntries={['/experiences']}>
        <LocationProbe />
        <HashLink hash="categories">Découvrir</HashLink>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Découvrir' }));
    expect(screen.getByTestId('probe')).toHaveTextContent('/|#categories');
  });

  it('respecte la prévention par défaut du clic', () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, 'getElementById').mockReturnValue({ scrollIntoView } as unknown as HTMLElement);
    const replaceState = vi.spyOn(window.history, 'replaceState');

    render(
      <MemoryRouter initialEntries={['/']}>
        <HashLink hash="concept" onClick={(event) => event.preventDefault()}>À propos</HashLink>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'À propos' });
    fireEvent.click(link);
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(replaceState).not.toHaveBeenCalled();
  });
});