import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { Starfield } from './starfield';

describe('Starfield', () => {
  it('renders canvas element', () => {
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('canvas has absolute positioning class', () => {
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('absolute');
    expect(canvas).toHaveClass('inset-0');
  });

  it('canvas has pointer-events-none class', () => {
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('pointer-events-none');
  });

  it('renders without crashing', () => {
    expect(() => {
      render(<Starfield />);
    }).not.toThrow();
  });

  it('canvas has correct styling classes', () => {
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('h-full');
    expect(canvas).toHaveClass('w-full');
  });
});
