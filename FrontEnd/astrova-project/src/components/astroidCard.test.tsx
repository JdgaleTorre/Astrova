import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import AsteroidCard from './astroidCard';
import type { NeoAsteroid } from '../services/nasa';

const mockAsteroid: NeoAsteroid = {
  id: '12345',
  name: 'Test Asteroid',
  nasa_jpl_url: 'https://ssd.jpl.nasa.gov/sbdb.cgi?sstr=12345',
  absolute_magnitude_h: 22.5,
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: 0.5,
      estimated_diameter_max: 1.2,
    },
    meters: {
      estimated_diameter_min: 500,
      estimated_diameter_max: 1200,
    },
    miles: {
      estimated_diameter_min: 0.31,
      estimated_diameter_max: 0.75,
    },
    feet: {
      estimated_diameter_min: 1640,
      estimated_diameter_max: 3937,
    },
  },
  is_potentially_hazardous_asteroid: false,
  close_approach_data: [
    {
      close_approach_date: '2024-01-15',
      close_approach_date_full: '2024-Jan-15 14:30',
      relative_velocity: {
        kilometers_per_hour: '35000.5',
        kilometers_per_second: '9.72',
        miles_per_hour: '21750.3',
      },
      miss_distance: {
        astronomical: '0.05',
        lunar: '19.45',
        kilometers: '7479892',
        miles: '4648000',
      },
      orbiting_body: 'Earth',
    },
  ],
};

const mockHazardousAsteroid: NeoAsteroid = {
  ...mockAsteroid,
  id: '67890',
  name: 'Hazardous Asteroid',
  is_potentially_hazardous_asteroid: true,
};

describe('AsteroidCard', () => {
  it('renders asteroid name', () => {
    render(<AsteroidCard asteroid={mockAsteroid} />);
    expect(screen.getByText('Test Asteroid')).toBeInTheDocument();
  });

  it('renders JPL link', () => {
    render(<AsteroidCard asteroid={mockAsteroid} />);
    const link = screen.getByRole('link', { name: /NASA JPL/i });
    expect(link).toHaveAttribute(
      'href',
      'https://ssd.jpl.nasa.gov/sbdb.cgi?sstr=12345',
    );
  });

  it('displays size information', () => {
    render(<AsteroidCard asteroid={mockAsteroid} />);
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it('displays velocity information', () => {
    render(<AsteroidCard asteroid={mockAsteroid} />);
    expect(screen.getByText('Velocity')).toBeInTheDocument();
    expect(screen.getByText(/km\/h/)).toBeInTheDocument();
  });

  it('displays miss distance', () => {
    render(<AsteroidCard asteroid={mockAsteroid} />);
    expect(screen.getByText('Miss Distance')).toBeInTheDocument();
  });

  it('displays approach date', () => {
    render(<AsteroidCard asteroid={mockAsteroid} />);
    expect(screen.getByText('Approach')).toBeInTheDocument();
  });

  it('shows hazardous badge when asteroid is hazardous', () => {
    render(<AsteroidCard asteroid={mockHazardousAsteroid} />);
    expect(screen.getByText('Hazardous')).toBeInTheDocument();
  });

  it('does not show hazardous badge when asteroid is not hazardous', () => {
    render(<AsteroidCard asteroid={mockAsteroid} />);
    expect(screen.queryByText('Hazardous')).not.toBeInTheDocument();
  });
});
