import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import AcronymTitle from './acronymTitle';

describe('AcronymTitle', () => {
  it('renders text correctly', () => {
    const { container } = render(<AcronymTitle text="Hello World" />);
    expect(container.textContent).toBe('Hello World');
  });

  it('applies primary color to uppercase letters (acronym)', () => {
    const { container } = render(<AcronymTitle text="NASA" />);
    const spans = container.querySelectorAll('span');
    spans.forEach((span) => {
      expect(span).toHaveClass('text-primary');
    });
  });

  it('applies soft-white color to lowercase letters', () => {
    const { container } = render(<AcronymTitle text="hello" />);
    const spans = container.querySelectorAll('span');
    spans.forEach((span) => {
      expect(span).toHaveClass('text-soft-white');
    });
  });

  it('applies correct color to mixed case text', () => {
    const { container } = render(<AcronymTitle text="ApodNASA" />);
    const spans = container.querySelectorAll('span');
    // A is uppercase, so it's treated as an acronym letter (text-primary)
    expect(spans[0]).toHaveClass('text-primary'); // A (uppercase)
    expect(spans[1]).toHaveClass('text-soft-white'); // p (lowercase)
    expect(spans[2]).toHaveClass('text-soft-white'); // o (lowercase)
    expect(spans[3]).toHaveClass('text-soft-white'); // d (lowercase)
    expect(spans[4]).toHaveClass('text-primary'); // N (uppercase)
    expect(spans[5]).toHaveClass('text-primary'); // A (uppercase)
    expect(spans[6]).toHaveClass('text-primary'); // S (uppercase)
    expect(spans[7]).toHaveClass('text-primary'); // A (uppercase)
  });

  it('handles empty string', () => {
    const { container } = render(<AcronymTitle text="" />);
    expect(container.textContent).toBe('');
  });

  it('handles single letter', () => {
    const { container } = render(<AcronymTitle text="A" />);
    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(1);
    expect(spans[0]).toHaveClass('text-primary');
  });

  it('renders correct number of spans', () => {
    const { container } = render(<AcronymTitle text="ABC" />);
    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(3);
  });
});
