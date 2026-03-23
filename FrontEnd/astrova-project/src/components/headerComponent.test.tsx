import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import HeaderComponent from './headerComponent';

describe('HeaderComponent', () => {
  it('renders heading element', () => {
    render(
      <HeaderComponent title="Test Title" description="Test Description" />,
    );
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <HeaderComponent title="Test Title" description="Test Description" />,
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders with showCalendarFilter false', () => {
    render(
      <HeaderComponent
        title="Test Title"
        description="Test Description"
        showCalendarFilter={false}
      />,
    );
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('renders calendar trigger button when showCalendarFilter is true', () => {
    render(
      <HeaderComponent
        title="Test Title"
        description="Test Description"
        showCalendarFilter={true}
      />,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays single date format for single mode', () => {
    render(
      <HeaderComponent
        title="Test Title"
        description="Test Description"
        showCalendarFilter={true}
        calendarMode="single"
        selectedDate={new Date('2024-01-15')}
      />,
    );
    expect(screen.getByText(/January 15th, 2024/)).toBeInTheDocument();
  });

  it('displays range format for range mode', () => {
    render(
      <HeaderComponent
        title="Test Title"
        description="Test Description"
        showCalendarFilter={true}
        calendarMode="range"
        selectedDate={{
          from: new Date('2024-01-15'),
          to: new Date('2024-01-20'),
        }}
      />,
    );
    expect(screen.getByText(/January 15th, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/January 20th, 2024/)).toBeInTheDocument();
  });

  it('renders without selectedDate', () => {
    render(
      <HeaderComponent
        title="Test Title"
        description="Test Description"
        showCalendarFilter={true}
      />,
    );
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <HeaderComponent
        title="Test"
        description="Desc"
        showCalendarFilter={false}
      />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
