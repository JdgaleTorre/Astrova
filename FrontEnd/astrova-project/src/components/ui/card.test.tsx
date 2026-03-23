import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from './card';

describe('Card', () => {
  it('renders Card with correct data-slot', () => {
    const { container } = render(<Card>Card Content</Card>);
    expect(container.firstChild).toHaveAttribute('data-slot', 'card');
  });

  it('Card applies correct classes', () => {
    const { container } = render(<Card>Card Content</Card>);
    expect(container.firstChild).toHaveClass('bg-card');
    expect(container.firstChild).toHaveClass('text-card-foreground');
  });

  it('Card forwards className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('CardHeader', () => {
  it('renders CardHeader with correct data-slot', () => {
    const { container } = render(<CardHeader>Header Content</CardHeader>);
    expect(container.firstChild).toHaveAttribute('data-slot', 'card-header');
  });

  it('CardHeader forwards className', () => {
    const { container } = render(<CardHeader className="custom-class">Header</CardHeader>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('CardTitle', () => {
  it('renders CardTitle with correct data-slot', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    expect(container.firstChild).toHaveAttribute('data-slot', 'card-title');
  });

  it('CardTitle renders as h4', () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    expect(container.querySelector('h4')).toBeInTheDocument();
  });

  it('CardTitle forwards className', () => {
    const { container } = render(<CardTitle className="custom-class">Title</CardTitle>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('CardDescription', () => {
  it('renders CardDescription with correct data-slot', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    expect(container.firstChild).toHaveAttribute('data-slot', 'card-description');
  });

  it('CardDescription renders as p', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('CardDescription has muted-foreground class', () => {
    const { container } = render(<CardDescription>Description</CardDescription>);
    expect(container.firstChild).toHaveClass('text-muted-foreground');
  });
});

describe('CardAction', () => {
  it('renders CardAction with correct data-slot', () => {
    const { container } = render(<CardAction>Action</CardAction>);
    expect(container.firstChild).toHaveAttribute('data-slot', 'card-action');
  });

  it('CardAction forwards className', () => {
    const { container } = render(<CardAction className="custom-class">Action</CardAction>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('CardContent', () => {
  it('renders CardContent with correct data-slot', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    expect(container.firstChild).toHaveAttribute('data-slot', 'card-content');
  });

  it('CardContent forwards className', () => {
    const { container } = render(<CardContent className="custom-class">Content</CardContent>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('CardFooter', () => {
  it('renders CardFooter with correct data-slot', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    expect(container.firstChild).toHaveAttribute('data-slot', 'card-footer');
  });

  it('CardFooter forwards className', () => {
    const { container } = render(<CardFooter className="custom-class">Footer</CardFooter>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
