import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import ApodCardCompact from './apodCardCompact';
import type { ApodResponse } from '../services/nasa';

jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => jest.fn(),
}));

const mockApodResponse: ApodResponse = {
  date: '2024-01-15',
  title: 'Test APOD',
  explanation: 'Test explanation',
  url: 'https://example.com/image.jpg',
  hdurl: 'https://example.com/image-hd.jpg',
  media_type: 'image',
  ai_summary: 'AI summary',
};

const mockVideoApod: ApodResponse = {
  date: '2024-01-16',
  title: 'Test Video',
  explanation: 'Video explanation',
  url: 'https://example.com/video.mp4',
  hdurl: 'https://example.com/video-hd.mp4',
  media_type: 'video',
  ai_summary: 'Video AI',
};

const mockVideoApodAsAudio: ApodResponse = {
  date: '2024-01-17',
  title: 'Test Video as Audio',
  explanation: 'Video as audio explanation',
  url: 'https://example.com/audio.mp3',
  hdurl: 'https://example.com/audio.mp3',
  media_type: 'video',
  ai_summary: 'Audio AI',
};

describe('ApodCardCompact', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders card with title and date', () => {
    render(<ApodCardCompact {...mockApodResponse} />);
    expect(screen.getByText('Test APOD')).toBeInTheDocument();
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  it('displays image media type badge', () => {
    render(<ApodCardCompact {...mockApodResponse} />);
    expect(screen.getByText('image')).toBeInTheDocument();
  });

  it('displays video media type badge', () => {
    render(<ApodCardCompact {...mockVideoApod} />);
    expect(screen.getByText('video')).toBeInTheDocument();
  });

  it('shows play icon for video type', () => {
    render(<ApodCardCompact {...mockVideoApod} />);
    const playIcon = document.querySelector('svg');
    expect(playIcon).toBeInTheDocument();
  });

  it('renders bookmark button', () => {
    render(<ApodCardCompact {...mockApodResponse} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows video badge for audio-like content', () => {
    render(<ApodCardCompact {...mockVideoApodAsAudio} />);
    expect(screen.getByText('video')).toBeInTheDocument();
  });

  it('renders without crashing when not saved', () => {
    expect(() => {
      render(<ApodCardCompact {...mockApodResponse} />);
    }).not.toThrow();
  });
});
