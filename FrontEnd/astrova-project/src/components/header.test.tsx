import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Header } from './header';

jest.mock('@tanstack/react-router', () => ({
    useLocation: jest.fn(() => ({ pathname: '/' })),
    Link: ({ children }: { children: React.ReactNode }) => <a href="/">{children}</a>,
}));

describe('Header', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders logo text', () => {
        render(<Header />);
        expect(screen.getByText('Astro')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(<Header />);
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('APOD')).toBeInTheDocument();
        expect(screen.getByText('Mars Rovers')).toBeInTheDocument();
        expect(screen.getByText('Asteroids')).toBeInTheDocument();
        expect(screen.getByText('EPIC')).toBeInTheDocument();
    });

    it('highlights active navigation item', () => {
        const { useLocation } = jest.requireMock('@tanstack/react-router');
        useLocation.mockReturnValue({ pathname: '/apod' });
        const { container } = render(<Header />);
        const activeLink = container.querySelector('.text-cyan');
        expect(activeLink).toBeInTheDocument();
    });

    it('renders as a header element', () => {
        render(<Header />);
        expect(document.querySelector('header')).toBeInTheDocument();
    });
});
