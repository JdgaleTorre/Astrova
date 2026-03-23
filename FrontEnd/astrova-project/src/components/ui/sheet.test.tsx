import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './sheet';

describe('Sheet', () => {
  it('renders without crashing', () => {
    expect(() => {
      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
        </Sheet>,
      );
    }).not.toThrow();
  });
});

describe('SheetTrigger', () => {
  it('renders SheetTrigger with data-slot', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
      </Sheet>,
    );
    expect(
      container.querySelector('[data-slot="sheet-trigger"]'),
    ).toBeInTheDocument();
  });

  it('renders as a button', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
      </Sheet>,
    );
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('forwards children', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
      </Sheet>,
    );
    expect(container.textContent).toBe('Open Sheet');
  });
});

describe('SheetContent', () => {
  it('renders without crashing when open', () => {
    // SheetContent uses Portal, which renders outside the container
    expect(() => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Description</SheetDescription>
            Content
          </SheetContent>
        </Sheet>,
      );
    }).not.toThrow();
  });
});

describe('SheetHeader', () => {
  it('renders SheetHeader with data-slot', () => {
    const { container } = render(<SheetHeader>Header</SheetHeader>);
    expect(
      container.querySelector('[data-slot="sheet-header"]'),
    ).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(
      <SheetHeader className="custom-class">Header</SheetHeader>,
    );
    expect(container.querySelector('[data-slot="sheet-header"]')).toHaveClass(
      'custom-class',
    );
  });
});

describe('SheetFooter', () => {
  it('renders SheetFooter with data-slot', () => {
    const { container } = render(<SheetFooter>Footer</SheetFooter>);
    expect(
      container.querySelector('[data-slot="sheet-footer"]'),
    ).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(
      <SheetFooter className="custom-class">Footer</SheetFooter>,
    );
    expect(container.querySelector('[data-slot="sheet-footer"]')).toHaveClass(
      'custom-class',
    );
  });
});

describe('SheetTitle', () => {
  it('renders without crashing when inside Sheet', () => {
    expect(() => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Description</SheetDescription>
          </SheetContent>
        </Sheet>,
      );
    }).not.toThrow();
  });
});

describe('SheetDescription', () => {
  it('renders without crashing when inside Sheet', () => {
    expect(() => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Description</SheetDescription>
          </SheetContent>
        </Sheet>,
      );
    }).not.toThrow();
  });
});
