import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Header } from './header';
import { NAVIGATION_LINKS } from '../utils/navigationLinks';

jest.mock('@tanstack/react-router', () => ({
    useLocation: jest.fn(() => ({ pathname: '/' })),
    Link: ({ to, children, id, className }: {
        to: string;
        children: React.ReactNode;
        id?: string;
        className?: string;
    }) => <a href={to} id={id} className={className}>{children}</a>,
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
        NAVIGATION_LINKS.map((nav) => {
            expect(screen.getByText(nav.label)).toBeInTheDocument();
        })
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
});
