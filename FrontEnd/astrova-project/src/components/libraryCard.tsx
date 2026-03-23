import { useNavigate } from '@tanstack/react-router';
import type { MediaAsset } from '../services/nasa';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Image, Video, Calendar, Volume2, Bookmark, BookmarkCheck } from 'lucide-react';
import { isSaved, toggleSaved } from '../services/storage';
import { useState } from 'react';

export default function LibraryCard(item: MediaAsset) {
  const nasaId = item.data[0]?.nasa_id;
  const imageUrl =
    item.links?.find((link) => link.render === 'image')?.href || item.href;
  const title = item.data[0]?.title || 'Untitled';
  const date = item.data[0]?.date_created
    ? format(new Date(item.data[0].date_created), 'MMM d, yyyy')
    : 'Unknown date';
  const mediaType = (item.data[0]?.media_type || 'image') as 'image' | 'video' | 'audio';

  const [saved, setSaved] = useState(() => isSaved(nasaId));

  const navigate = useNavigate();

  if (!nasaId) return null;

  return (
    <div
      key={nasaId}
      onClick={() => navigate({ to: '/library/$id', params: { id: nasaId } })}
      className="block cursor-pointer"
    >
      <Card className="bg-card/50 group hover:border-cyan/30 h-full overflow-hidden border-white/5 backdrop-blur-sm transition-all">
        <div className="bg-surface relative aspect-square overflow-hidden">
          {mediaType === 'audio' ? (
            <div className="from-cyan/20 flex h-full w-full items-center justify-center bg-linear-to-br to-purple-500/20">
              <Volume2 className="text-cyan/50 h-16 w-16" />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              className="bg-background/80 inline-flex items-center justify-center rounded-full border border-white/10 p-1.5 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-cyan/20"
              onClick={(e) => {
                e.stopPropagation();
                const savedItem = {
                  id: nasaId,
                  type: 'library' as const,
                  media_type: mediaType,
                  date: item.data[0]?.date_created || new Date().toISOString(),
                  title: title,
                  thumbnail: imageUrl,
                  url: item.links?.[0]?.href || item.href,
                  description: item.data[0]?.description,
                  savedAt: new Date().toISOString(),
                };
                setSaved(toggleSaved(savedItem));
              }}
            >
              {saved ? (
                <BookmarkCheck className="text-cyan h-4 w-4" />
              ) : (
                <Bookmark className="text-soft-white h-4 w-4" />
              )}
            </button>
            <span className="bg-background/80 inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-xs font-medium backdrop-blur-sm">
              {mediaType === 'video' ? (
                <Video className="text-cyan h-3 w-3" />
              ) : mediaType === 'audio' ? (
                <Volume2 className="text-cyan h-3 w-3" />
              ) : (
                <Image className="text-cyan h-3 w-3" />
              )}
              <span className="text-soft-white capitalize">{mediaType}</span>
            </span>
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-soft-white line-clamp-2 text-sm font-medium">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
