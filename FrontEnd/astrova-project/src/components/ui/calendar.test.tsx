import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { Calendar } from './calendar';

describe('Calendar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Calendar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Calendar className="custom-calendar" />);
    expect(container.firstChild).toHaveClass('custom-calendar');
  });

  it('renders with showOutsideDays default to true', () => {
    const { container } = render(<Calendar />);
    expect(container.querySelector('.p-3')).toBeInTheDocument();
  });

  it('renders with showOutsideDays set to false', () => {
    const { container } = render(<Calendar showOutsideDays={false} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom classNames to internal elements', () => {
    const customClassNames = {
      day: 'custom-day-class',
      today: 'custom-today-class',
      selected: 'custom-selected-class',
    };
    const { container } = render(<Calendar classNames={customClassNames} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
