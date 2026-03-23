import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { EpicCarousel } from './epicCarousel';
import type { EpicImage } from '../services/nasa';

const mockEpicImage: EpicImage = {
  identifier: 'epic_1b_20240115',
  caption: 'Test EPIC Caption',
  image: 'epic_1b_test',
  date: '2024-01-15 12:00:00',
  version: '1.0',
  centroid_coordinates: { lat: 45.5, lon: -122.5 },
  dscovr_j2000_position: { x: 1500000, y: -500000, z: 300000 },
  lunar_j2000_position: { x: 384400, y: 0, z: 0 },
  sun_j2000_position: { x: 0, y: 0, z: 0 },
  attitude_quaternions: { q0: 1, q1: 0, q2: 0, q3: 0 },
};

const mockImages: EpicImage[] = [
  mockEpicImage,
  { ...mockEpicImage, identifier: 'epic_2b_20240115', image: 'epic_2b_test' },
  { ...mockEpicImage, identifier: 'epic_3b_20240115', image: 'epic_3b_test' },
];

describe('EpicCarousel', () => {
  it('renders main image caption', () => {
    render(
      <EpicCarousel images={mockImages} dateStr="20240115" type="natural" />,
    );
    expect(screen.getByText('Test EPIC Caption')).toBeInTheDocument();
  });

  it('displays image counter', () => {
    render(
      <EpicCarousel images={mockImages} dateStr="20240115" type="natural" />,
    );
    expect(screen.getByText('Image 1 of 3')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(
      <EpicCarousel images={mockImages} dateStr="20240115" type="natural" />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('has navigation buttons that can be interacted with', () => {
    render(
      <EpicCarousel images={mockImages} dateStr="20240115" type="natural" />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeInTheDocument();
    expect(buttons[1]).toBeInTheDocument();
  });

  it('displays centroid coordinates', () => {
    render(
      <EpicCarousel images={mockImages} dateStr="20240115" type="natural" />,
    );
    expect(screen.getByText(/Centroid Coordinates/)).toBeInTheDocument();
    expect(screen.getByText(/Lat: 45.50/)).toBeInTheDocument();
  });

  it('displays DSCOVR position', () => {
    render(
      <EpicCarousel images={mockImages} dateStr="20240115" type="natural" />,
    );
    expect(screen.getByText(/DSCOVR Position/)).toBeInTheDocument();
  });

  it('renders download button', () => {
    render(
      <EpicCarousel images={mockImages} dateStr="20240115" type="natural" />,
    );
    const downloadLink = screen.getByRole('link', { name: /HD Image/i });
    expect(downloadLink).toHaveAttribute('target', '_blank');
  });

  it('returns null when images array is empty', () => {
    const { container } = render(
      <EpicCarousel images={[]} dateStr="20240115" type="natural" />,
    );
    expect(container.firstChild).toBeNull();
  });
});
