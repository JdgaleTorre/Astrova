import { ChevronLeft, ChevronRight, Download, Globe, MapPin, Satellite } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle } from './ui/card'
import { ImageCarousel } from './ui/imageCarousel'
import type { EpicImage, EpicType } from '../services/nasa'
import { useState } from 'react'

interface EpicCarouselProps {
  images: EpicImage[]
  dateStr: string
  type: EpicType
}

export function EpicCarousel({ images, dateStr, type }: EpicCarouselProps) {
  const [selectedIndex, onSelect] = useState(0); // ← starts at 0 on every mount

  if (!images || !images[selectedIndex]) return null

  const currentImage = images[selectedIndex]
  const mainImageUrl = `https://epic.gsfc.nasa.gov/archive/${type}/${dateStr}/png/${currentImage.image}.png`
  const thumbnailUrls = images.map(img =>
    `https://epic.gsfc.nasa.gov/archive/${type}/${dateStr}/thumbs/${img.image}.jpg`
  )

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl group">
        <Card className="overflow-hidden border-space-cyan/20 hover:shadow-2xl hover:shadow-space-cyan/20 transition-all">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="relative group lg:col-span-2">
              <img
                src={mainImageUrl}
                alt={currentImage.caption}
                className="w-full h-full object-cover min-h-100"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  className="bg-cyan/90 hover:bg-cyan text-background backdrop-blur-sm shadow-lg"
                  asChild
                >
                  <a href={mainImageUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    HD Image
                  </a>
                </Button>
              </div>
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/50 hover:bg-background/70 backdrop-blur-sm border-white/20"
                  onClick={() => onSelect(Math.max(0, selectedIndex - 1))}
                  disabled={selectedIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-soft-white border border-white/20">
                  Image {selectedIndex + 1} of {images.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/50 hover:bg-background/70 backdrop-blur-sm border-white/20"
                  onClick={() => onSelect(Math.min(images.length - 1, selectedIndex + 1))}
                  disabled={selectedIndex === images.length - 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Satellite className="h-4 w-4 text-space-cyan" />
                <span className="text-sm font-medium text-space-cyan">
                  {new Date(currentImage.date).toLocaleString()}
                </span>
              </div>
              <CardTitle className="text-2xl mb-3">{currentImage.caption}</CardTitle>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Centroid Coordinates</p>
                    <p className="text-sm text-muted-foreground">
                      Lat: {currentImage.centroid_coordinates.lat.toFixed(2)}° •
                      Lon: {currentImage.centroid_coordinates.lon.toFixed(2)}°
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-space-cyan mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">DSCOVR Position</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      X: {(currentImage.dscovr_j2000_position.x / 1000000).toFixed(2)}M km<br />
                      Y: {(currentImage.dscovr_j2000_position.y / 1000000).toFixed(2)}M km<br />
                      Z: {(currentImage.dscovr_j2000_position.z / 1000000).toFixed(2)}M km
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t pb-4">
                  <p className="text-xs text-muted-foreground">
                    Version: {currentImage.version} • Identifier: {currentImage.identifier}
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
  )
}
