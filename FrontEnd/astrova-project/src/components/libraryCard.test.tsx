import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import LibraryCard from './libraryCard';
import type { MediaAsset } from '../services/nasa';

jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => jest.fn(),
}));

const mockMediaAsset: MediaAsset = {
  data: [
    {
      nasa_id: 'test-123',
      title: 'Test Library Item',
      description: 'Test description',
      media_type: 'image',
      date_created: '2024-01-15T12:00:00Z',
      photographer: 'Test Photographer',
    },
  ],
  href: 'https://example.com/image.jpg',
  links: [{ href: 'https://example.com/image.jpg', rel: 'preview', render: 'image' }],
};

const mockVideoAsset: MediaAsset = {
  data: [
    {
      nasa_id: 'test-456',
      title: 'Test Video Item',
      description: 'Video description',
      media_type: 'video',
      date_created: '2024-01-16T12:00:00Z',
    },
  ],
  href: 'https://example.com/video.mp4',
};

const mockAudioAsset: MediaAsset = {
  data: [
    {
      nasa_id: 'test-789',
      title: 'Test Audio Item',
      description: 'Audio description',
      media_type: 'audio',
      date_created: '2024-01-17T12:00:00Z',
    },
  ],
  href: 'https://example.com/audio.mp3',
};

describe('LibraryCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders item title', () => {
    render(<LibraryCard {...mockMediaAsset} />);
    expect(screen.getByText('Test Library Item')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    render(<LibraryCard {...mockMediaAsset} />);
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  it('displays image badge for image type', () => {
    render(<LibraryCard {...mockMediaAsset} />);
    expect(screen.getByText('image')).toBeInTheDocument();
  });

  it('displays video badge for video type', () => {
    render(<LibraryCard {...mockVideoAsset} />);
    expect(screen.getByText('video')).toBeInTheDocument();
  });

  it('renders audio placeholder for audio type', () => {
    render(<LibraryCard {...mockAudioAsset} />);
    expect(screen.getByText('audio')).toBeInTheDocument();
  });

  it('has bookmark button', () => {
    render(<LibraryCard {...mockMediaAsset} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders image thumbnail', () => {
    render(<LibraryCard {...mockMediaAsset} />);
    const img = document.querySelector('img');
    expect(img).toBeInTheDocument();
  });

  it('renders with title when photographer is missing', () => {
    const noPhotographer = {
      ...mockMediaAsset,
      data: [{ ...mockMediaAsset.data[0], photographer: undefined }],
    };
    render(<LibraryCard {...noPhotographer} />);
    expect(screen.getByText('Test Library Item')).toBeInTheDocument();
  });

  it('returns null when nasa_id is missing', () => {
    const noId: MediaAsset = {
      ...mockMediaAsset,
      data: [{ ...mockMediaAsset.data[0], nasa_id: '' }],
    };
    const { container } = render(<LibraryCard {...noId} />);
    expect(container.firstChild).toBeNull();
  });

  it('uses href when no image link is available', () => {
    const noLinks: MediaAsset = {
      ...mockMediaAsset,
      links: [],
    };
    render(<LibraryCard {...noLinks} />);
    const img = document.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });
});
