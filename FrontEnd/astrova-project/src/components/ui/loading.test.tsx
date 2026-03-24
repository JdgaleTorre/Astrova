import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { Loading } from './loading';

describe('Loading', () => {
  it('renders with default size (md)', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with sm size', () => {
    const { container } = render(<Loading size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('viewBox')).toContain('80');
  });

  it('renders with md size', () => {
    const { container } = render(<Loading size="md" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('viewBox')).toContain('120');
  });

  it('renders with lg size', () => {
    const { container } = render(<Loading size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.getAttribute('viewBox')).toContain('160');
  });

  it('has spin animation class', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('.animate-spin-slow')).toBeInTheDocument();
  });

  it('renders with custom className on wrapper', () => {
    const { container } = render(<Loading className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('contains earth gradient', () => {
    const { container } = render(<Loading />);
    expect(container.innerHTML).toContain('url(#earthGradient)');
  });

  it('contains satellite elements', () => {
    const { container } = render(<Loading />);
    const svg = container.querySelector('svg');
    expect(svg?.innerHTML).toContain('rect');
  });
});
