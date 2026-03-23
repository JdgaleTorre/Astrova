import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from './popover';

describe('Popover', () => {
  it('renders without crashing', () => {
    expect(() => {
      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
        </Popover>,
      );
    }).not.toThrow();
  });
});

describe('PopoverTrigger', () => {
  it('renders PopoverTrigger within Popover context', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
      </Popover>,
    );
    expect(
      container.querySelector('[data-slot="popover-trigger"]'),
    ).toBeInTheDocument();
  });

  it('renders as a button', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
      </Popover>,
    );
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('forwards children', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
      </Popover>,
    );
    expect(container.textContent).toBe('Open Popover');
  });
});

describe('PopoverContent', () => {
  it('renders without crashing when open', () => {
    // PopoverContent uses Portal, which renders outside the container
    expect(() => {
      render(
        <Popover open>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      );
    }).not.toThrow();
  });
});

describe('PopoverAnchor', () => {
  it('renders PopoverAnchor within Popover context', () => {
    const { container } = render(
      <Popover>
        <PopoverAnchor>Anchor</PopoverAnchor>
      </Popover>,
    );
    expect(
      container.querySelector('[data-slot="popover-anchor"]'),
    ).toBeInTheDocument();
  });
});
