import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { StatusIndicator } from './statusIndicator';

describe('StatusIndicator', () => {
  it('renders with online status', () => {
    const { container } = render(<StatusIndicator status="online" />);
    const indicator = container.querySelector('#indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('bg-green-500');
  });

  it('renders with offline status', () => {
    const { container } = render(<StatusIndicator status="offline" />);
    const indicator = container.querySelector('#indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('bg-red-500');
  });

  it('renders with loading status', () => {
    const { container } = render(<StatusIndicator status="loading" />);
    const indicator = container.querySelector('#indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('bg-amber-500');
    expect(indicator).toHaveClass('animate-pulse');
  });

  it('shows text by default', () => {
    render(<StatusIndicator status="online" />);
    expect(screen.getByText('Backend Online')).toBeInTheDocument();
  });

  it('shows offline text', () => {
    render(<StatusIndicator status="offline" />);
    expect(screen.getByText('Backend Offline')).toBeInTheDocument();
  });

  it('hides text when notShowText is true', () => {
    render(<StatusIndicator status="online" notShowText />);
    expect(screen.queryByText('Backend Online')).toBeNull();
  });

  it('shows empty status text for loading status', () => {
    const { container } = render(<StatusIndicator status="loading" />);
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    // For loading status, the status text is empty
    expect(span?.textContent).toBe('Backend ');
  });

  it('applies shadow class based on status', () => {
    const { container: onlineContainer } = render(
      <StatusIndicator status="online" />,
    );
    expect(onlineContainer.querySelector('#indicator')).toHaveClass(
      'shadow-green-500/50',
    );

    const { container: offlineContainer } = render(
      <StatusIndicator status="offline" />,
    );
    expect(offlineContainer.querySelector('#indicator')).toHaveClass(
      'shadow-red-500/50',
    );
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatusIndicator status="online" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has rounded-full class on indicator', () => {
    const { container } = render(<StatusIndicator status="online" />);
    expect(container.querySelector('#indicator')).toHaveClass('rounded-full');
  });
});
