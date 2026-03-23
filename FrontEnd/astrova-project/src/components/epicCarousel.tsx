import {
  ChevronLeft,
  ChevronRight,
  Download,
  Globe,
  MapPin,
  Satellite,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle } from './ui/card';
import { ImageCarousel } from './ui/imageCarousel';
import type { EpicImage, EpicType } from '../services/nasa';
import { useState } from 'react';

interface EpicCarouselProps {
  images: EpicImage[];
  dateStr: string;
  type: EpicType;
}

export function EpicCarousel({ images, dateStr, type }: EpicCarouselProps) {
  const [selectedIndex, onSelect] = useState(0); // ← starts at 0 on every mount

  if (!images || !images[selectedIndex]) return null;

  const currentImage = images[selectedIndex];
  const mainImageUrl = `https://epic.gsfc.nasa.gov/archive/${type}/${dateStr}/png/${currentImage.image}.png`;
  const thumbnailUrls = images.map(
    (img) =>
      `https://epic.gsfc.nasa.gov/archive/${type}/${dateStr}/thumbs/${img.image}.jpg`,
  );

  return (
    <div>
      <div className="group relative overflow-hidden rounded-2xl">
        <Card className="border-space-cyan/20 hover:shadow-space-cyan/20 overflow-hidden transition-all hover:shadow-2xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="group relative lg:col-span-2">
              <img
                src={mainImageUrl}
                alt={currentImage.caption}
                className="h-full min-h-100 w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute top-6 right-6 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="sm"
                  className="bg-cyan/90 hover:bg-cyan text-background shadow-lg backdrop-blur-sm"
                  asChild
                >
                  <a
                    href={mainImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    HD Image
                  </a>
                </Button>
              </div>
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/50 hover:bg-background/70 border-white/20 backdrop-blur-sm"
                  onClick={() => onSelect(Math.max(0, selectedIndex - 1))}
                  disabled={selectedIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="bg-background/50 text-soft-white rounded-full border border-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                  Image {selectedIndex + 1} of {images.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/50 hover:bg-background/70 border-white/20 backdrop-blur-sm"
                  onClick={() =>
                    onSelect(Math.min(images.length - 1, selectedIndex + 1))
                  }
                  disabled={selectedIndex === images.length - 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Satellite className="text-space-cyan h-4 w-4" />
                <span className="text-space-cyan text-sm font-medium">
                  {new Date(currentImage.date).toLocaleString()}
                </span>
              </div>
              <CardTitle className="mb-3 text-2xl">
                {currentImage.caption}
              </CardTitle>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">Centroid Coordinates</p>
                    <p className="text-muted-foreground text-sm">
                      Lat: {currentImage.centroid_coordinates.lat.toFixed(2)}° •
                      Lon: {currentImage.centroid_coordinates.lon.toFixed(2)}°
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="text-space-cyan mt-0.5 h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">DSCOVR Position</p>
                    <p className="text-muted-foreground font-mono text-sm">
                      X:{' '}
                      {(currentImage.dscovr_j2000_position.x / 1000000).toFixed(
                        2,
                      )}
                      M km
                      <br />
                      Y:{' '}
                      {(currentImage.dscovr_j2000_position.y / 1000000).toFixed(
                        2,
                      )}
                      M km
                      <br />
                      Z:{' '}
                      {(currentImage.dscovr_j2000_position.z / 1000000).toFixed(
                        2,
                      )}
                      M km
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 pb-4">
                  <p className="text-muted-foreground text-xs">
                    Version: {currentImage.version} • Identifier:{' '}
                    {currentImage.identifier}
                  </p>
                </div>
              </div>
            </CardHeader>
          </div>
        </Card>
      </div>
      <ImageCarousel
        imageUrls={thumbnailUrls}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
      />
    </div>
  );
}
