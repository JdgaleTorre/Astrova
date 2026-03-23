import { createFileRoute } from '@tanstack/react-router';
import { getSavedItems } from '../services/storage';
import HeaderComponent from '../components/headerComponent';
import ApodCardCompact from '../components/apodCardCompact';
import LibraryCard from '../components/libraryCard';
import {
  adaptToApodResponse,
  adaptToMediaAsset,
} from '../utils/savedItemAdapter';
import { Bookmark } from 'lucide-react';

export const Route = createFileRoute('/saved')({
  component: SavedPage,
});

function SavedPage() {
  const savedItems = getSavedItems();

  return (
    <div className="flex min-h-screen flex-col pt-16">
      <HeaderComponent
        title="Saved Items"
        description="Your bookmarked NASA images and videos"
        showCalendarFilter={false}
      />
      <div className="container mx-auto max-w-7xl px-4 py-12 md:pt-48">
        {savedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bookmark className="text-muted-foreground mb-4 h-16 w-16 opacity-50" />
            <p className="text-muted-foreground text-lg">No saved items yet</p>
            <p className="text-muted-foreground text-sm">
              Bookmark images from APOD or Library to see them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {savedItems.map((item) =>
              item.type === 'apod' ? (
                <ApodCardCompact
                  key={item.id}
                  {...adaptToApodResponse(item)}
                />
              ) : (
                <LibraryCard
                  key={item.id}
                  {...adaptToMediaAsset(item)}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
