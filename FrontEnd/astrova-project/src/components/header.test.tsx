import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Header } from './header';
import { NAVIGATION_LINKS } from '../utils/navigationLinks.tsx';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-router', () => ({
    useLocation: jest.fn(() => ({ pathname: '/' })),
    Link: ({ to, children, id, className }: {
        to: string;
        children: React.ReactNode;
        id?: string;
        className?: string;
    }) => <a href={to} id={id} className={className}>{children}</a>,
}));

jest.mock('../services/health', () => ({
    checkHealth: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

describe('Header', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useQuery as jest.Mock).mockReturnValue({
            data: { status: 'ok', timestamp: new Date().toISOString(), uptime: 100, mongodb: 'connected' },
            isError: false,
        });
    });

    it('renders logo text', () => {
        render(<Header />);
        expect(screen.getByText('Astro')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(<Header />);
        NAVIGATION_LINKS.map((nav) => {
            expect(screen.getByText(nav.label)).toBeInTheDocument();
        });
    });

    it('highlights active navigation item', () => {
        const { useLocation } = jest.requireMock('@tanstack/react-router') as { useLocation: jest.Mock };
        useLocation.mockReturnValue({ pathname: '/apod' });
        const { container } = render(<Header />);
        const activeLink = container.querySelector('#active-nav-link');
        expect(activeLink).toBeInTheDocument();
    });

    it('renders as a header element', () => {
        render(<Header />);
        expect(document.querySelector('header')).toBeInTheDocument();
    });

    it('renders backend status indicator when online', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: { status: 'ok' },
            isError: false,
        });
        render(<Header />);
        expect(screen.getByText(/Backend Online/)).toBeInTheDocument();
    });

    it('renders backend status indicator when offline', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isError: true,
        });
        render(<Header />);
        expect(screen.getByText(/Backend Offline/)).toBeInTheDocument();
    });

    it('renders status indicator dot when loading', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isError: false,
        });
        render(<Header />);
        const dot = document.querySelector('#indicator');
        expect(dot).toHaveClass('animate-pulse');
    });
});
