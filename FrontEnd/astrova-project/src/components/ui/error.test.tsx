import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { ErrorDisplay } from './error';

describe('ErrorDisplay', () => {
    it('renders error message for 404', () => {
        const error = new Error('Not found') as Error & { response?: { status: number } };
        error.response = { status: 404 };
        render(<ErrorDisplay error={error} />);
        expect(screen.getByText('No astronomy picture found for this date')).toBeInTheDocument();
    });

    it('renders error message for 500', () => {
        const error = new Error('Server error') as Error & { response?: { status: number } };
        error.response = { status: 500 };
        render(<ErrorDisplay error={error} />);
        expect(screen.getByText("NASA's servers are experiencing issues. Please try again later")).toBeInTheDocument();
    });

    it('renders error message for network error', () => {
        const error = new Error('Network error') as Error & { code: string };
        error.code = 'ERR_NETWORK';
        render(<ErrorDisplay error={error} />);
        expect(screen.getByText('Unable to connect. Please check your internet connection')).toBeInTheDocument();
    });

    it('renders error message for timeout', () => {
        const error = new Error('Timeout') as Error & { code: string };
        error.code = 'ECONNABORTED';
        render(<ErrorDisplay error={error} />);
        expect(screen.getByText('Request timed out. Please check your connection and try again')).toBeInTheDocument();
    });

    it('renders generic message for unknown errors', () => {
        const error = new Error('Unknown error');
        render(<ErrorDisplay error={error} />);
        expect(screen.getByText('Unknown error')).toBeInTheDocument();
    });

    it('renders generic message for non-Error objects', () => {
        render(<ErrorDisplay error="Some string error" />);
        expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });

    it('forwards className', () => {
        const { container } = render(<ErrorDisplay error={new Error('test')} className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('displays alert icon', () => {
        render(<ErrorDisplay error={new Error('test')} />);
        const icon = document.querySelector('svg');
        expect(icon).toBeInTheDocument();
    });
});
