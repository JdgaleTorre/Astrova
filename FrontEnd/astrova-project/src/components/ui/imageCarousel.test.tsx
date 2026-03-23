import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import { ImageCarousel } from './imageCarousel';

describe('ImageCarousel', () => {
  const imageUrls = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  it('renders nothing when only one image', () => {
    const { container } = render(
      <ImageCarousel
        imageUrls={['https://example.com/image1.jpg']}
        selectedIndex={0}
        onSelect={jest.fn()}
      />
    );
    expect(container.querySelector('.scrollbar-thin')).toBeNull();
  });

  it('renders carousel when multiple images', () => {
    const { container } = render(
      <ImageCarousel
        imageUrls={imageUrls}
        selectedIndex={0}
        onSelect={jest.fn()}
      />
    );
    expect(container.querySelector('.scrollbar-thin')).toBeInTheDocument();
  });

  it('renders correct number of thumbnails', () => {
    render(
      <ImageCarousel
        imageUrls={imageUrls}
        selectedIndex={0}
        onSelect={jest.fn()}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('applies ring style to selected image', () => {
    render(
      <ImageCarousel
        imageUrls={imageUrls}
        selectedIndex={1}
        onSelect={jest.fn()}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveClass('ring-2');
  });

  it('applies opacity style to non-selected images', () => {
    render(
      <ImageCarousel
        imageUrls={imageUrls}
        selectedIndex={0}
        onSelect={jest.fn()}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveClass('opacity-60');
  });

  it('calls onSelect when thumbnail is clicked', async () => {
    const onSelect = jest.fn();
    render(
      <ImageCarousel
        imageUrls={imageUrls}
        selectedIndex={0}
        onSelect={onSelect}
      />
    );
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[2]);
    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('displays label text', () => {
    render(
      <ImageCarousel
        imageUrls={imageUrls}
        selectedIndex={0}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByText('All images from this date:')).toBeInTheDocument();
  });

  it('renders images with correct alt text', () => {
    render(
      <ImageCarousel
        imageUrls={imageUrls}
        selectedIndex={0}
        onSelect={jest.fn()}
      />
    );
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      expect(img).toHaveAttribute('alt', `Image ${index + 1}`);
    });
  });
});
