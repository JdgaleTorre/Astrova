interface ImageCarouselProps {
  imageUrls: string[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export function ImageCarousel({ imageUrls, selectedIndex, onSelect }: ImageCarouselProps) {
  return (
    <>
      {imageUrls.length > 1 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-muted-foreground">All images from this date:</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {imageUrls.map((url, index) => (
              <button
                key={url}
                onClick={() => onSelect(index)}
                className={`shrink-0 my-2 ml-1 rounded-lg overflow-hidden transition-all ${index === selectedIndex
                    ? 'ring-2 ring-cyan shadow-lg shadow-cyan/20'
                    : 'opacity-60 hover:opacity-100'
                  }`}
              >
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-32 h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
