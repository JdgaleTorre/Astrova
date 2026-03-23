import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import ApodCard from './apodCard';
import type { ApodResponse } from '../services/nasa';

const mockImageApod: ApodResponse = {
  date: '2024-01-15',
  title: 'Test Image APOD',
  explanation: 'This is a test image explanation.',
  url: 'https://example.com/image.jpg',
  hdurl: 'https://example.com/image-hd.jpg',
  media_type: 'image',
  copyright: 'Test Photographer',
  ai_summary: 'AI summary for image.',
};

const mockVideoApod: ApodResponse = {
  date: '2024-01-16',
  title: 'Test Video APOD',
  explanation: 'This is a test video explanation.',
  url: 'https://example.com/video.mp4',
  hdurl: 'https://example.com/video-hd.mp4',
  media_type: 'video',
  ai_summary: 'AI summary for video.',
};

describe('ApodCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders image APOD correctly', () => {
    render(<ApodCard {...mockImageApod} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('Test Image APOD')).toBeInTheDocument();
  });

  it('renders description for image APOD', () => {
    render(<ApodCard {...mockImageApod} />);
    expect(
      screen.getByText('This is a test image explanation.'),
    ).toBeInTheDocument();
  });

  it('renders copyright for image APOD', () => {
    render(<ApodCard {...mockImageApod} />);
    expect(screen.getByText(/© Test Photographer/)).toBeInTheDocument();
  });

  it('renders video APOD correctly', () => {
    render(<ApodCard {...mockVideoApod} />);
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('title', 'Test Video APOD');
  });

  it('renders description for video APOD', () => {
    render(<ApodCard {...mockVideoApod} />);
    expect(
      screen.getByText('This is a test video explanation.'),
    ).toBeInTheDocument();
  });

  it('renders download button', () => {
    render(<ApodCard {...mockImageApod} />);
    const downloadLink = screen.getByRole('link', { name: /HD Image/i });
    expect(downloadLink).toHaveAttribute(
      'href',
      'https://example.com/image-hd.jpg',
    );
  });

  it('renders AI insight card', () => {
    render(<ApodCard {...mockImageApod} />);
    expect(screen.getByText('AI Insight')).toBeInTheDocument();
    expect(screen.getByText('AI summary for image.')).toBeInTheDocument();
  });

  it('renders date badge', () => {
    render(<ApodCard {...mockImageApod} />);
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
  });

  it('has bookmark/save button', () => {
    render(<ApodCard {...mockImageApod} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders view original link', () => {
    render(<ApodCard {...mockImageApod} />);
    const originalLink = screen.getByRole('link', { name: /View Original/i });
    expect(originalLink).toBeInTheDocument();
  });
});
