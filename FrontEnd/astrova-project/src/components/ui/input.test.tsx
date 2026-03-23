import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import { Input } from './input';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders without explicit type attribute when undefined', () => {
    const { container } = render(<Input />);
    // When type is undefined, input defaults to text but no type attr is set
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('renders with custom type', () => {
    const { container } = render(<Input type="email" />);
    expect(container.querySelector('input')).toHaveAttribute('type', 'email');
  });

  it('renders with custom type password', () => {
    const { container } = render(<Input type="password" />);
    expect(container.querySelector('input')).toHaveAttribute(
      'type',
      'password',
    );
  });

  it('handles placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles value', () => {
    render(<Input value="test value" readOnly />);
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards className', () => {
    const { container } = render(<Input className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('accepts onChange prop without error', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies focus-visible styles', () => {
    const { container } = render(<Input />);
    expect(container.firstChild).toHaveClass('focus-visible:outline-none');
  });

  it('has correct base classes', () => {
    const { container } = render(<Input />);
    expect(container.firstChild).toHaveClass('bg-background');
    expect(container.firstChild).toHaveClass('border');
    expect(container.firstChild).toHaveClass('rounded-md');
  });
});
