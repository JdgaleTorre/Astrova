import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { Loading } from './loading';

describe('Loading', () => {
    it('renders with default size (md)', () => {
        const { container } = render(<Loading />);
        expect(container.querySelector('.size-12')).toBeInTheDocument();
    });

    it('renders with sm size', () => {
        const { container } = render(<Loading size="sm" />);
        expect(container.querySelector('.size-8')).toBeInTheDocument();
    });

    it('renders with md size', () => {
        const { container } = render(<Loading size="md" />);
        expect(container.querySelector('.size-12')).toBeInTheDocument();
    });

    it('renders with lg size', () => {
        const { container } = render(<Loading size="lg" />);
        expect(container.querySelector('.size-16')).toBeInTheDocument();
    });

    it('has spin animation class', () => {
        const { container } = render(<Loading />);
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('renders with custom className on inner spinner', () => {
        const { container } = render(<Loading className="custom-class" />);
        expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
});
