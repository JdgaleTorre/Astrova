interface ImageCarouselProps {
  imageUrls: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function ImageCarousel({
  imageUrls,
  selectedIndex,
  onSelect,
}: ImageCarouselProps) {
  return (
    <>
      {imageUrls.length > 1 && (
        <div className="mt-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              All images from this date:
            </span>
          </div>
          <div className="scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent flex gap-3 overflow-x-auto pb-4">
            {imageUrls.map((url, index) => (
              <button
                key={url}
                onClick={() => onSelect(index)}
                className={`my-2 ml-1 shrink-0 overflow-hidden rounded-lg transition-all ${
                  index === selectedIndex
                    ? 'ring-cyan shadow-cyan/20 shadow-lg ring-2'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="h-24 w-32 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
