import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import { Button } from './button';

describe('Button', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('data-slot', 'button');
    });

    it('renders with different variants', () => {
        const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
        variants.forEach(variant => {
            const { container } = render(<Button variant={variant}>Test</Button>);
            expect(container.firstChild).toBeInTheDocument();
        });
    });

    it('renders with different sizes', () => {
        const sizes = ['default', 'sm', 'lg', 'icon'] as const;
        sizes.forEach(size => {
            const { container } = render(<Button size={size}>Test</Button>);
            expect(container.firstChild).toBeInTheDocument();
        });
    });

    it('handles disabled state', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: 'Disabled' });
        expect(button).toBeDisabled();
    });

    it('handles onClick', async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click</Button>);
        await user.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('forwards className', () => {
        const { container } = render(<Button className="custom-class">Test</Button>);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
