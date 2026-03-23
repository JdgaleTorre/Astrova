import { useNavigate } from '@tanstack/react-router';
import type { ApodResponse } from '../services/nasa';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Image,
  Video,
  Calendar,
  Volume2,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { isSaved, toggleSaved } from '../services/storage';
import { useState } from 'react';

export default function ApodCardCompact(data: ApodResponse) {
  const [saved, setSaved] = useState(() => isSaved(data.date));
  const imageUrl = data.url;
  const title = data.title;
  const formattedDate = format(new Date(data.date), 'MMM d, yyyy');
  const mediaType = data.media_type as 'image' | 'video' | 'audio';

  const navigate = useNavigate();

  return (
    <div
      key={data.date}
      onClick={() =>
        navigate({ to: '/apod/$date', params: { date: data.date } })
      }
      className="block cursor-pointer"
    >
      <Card className="bg-card/50 group hover:border-cyan/30 h-full overflow-hidden border-white/5 backdrop-blur-sm transition-all">
        <div className="bg-surface relative aspect-square overflow-hidden">
          {mediaType === 'audio' ? (
            <div className="from-cyan/20 flex h-full w-full items-center justify-center bg-linear-to-br to-purple-500/20">
              <Volume2 className="text-cyan/50 h-16 w-16" />
            </div>
          ) : mediaType === 'video' ? (
            <div className="relative h-full w-full">
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Video className="h-12 w-12 text-white/80" />
              </div>
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
              className="bg-background/80 hover:bg-cyan/20 inline-flex items-center justify-center rounded-full border border-white/10 p-1.5 text-xs font-medium backdrop-blur-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                const savedItem = {
                  id: data.date,
                  type: 'apod' as const,
                  media_type: data.media_type,
                  date: data.date,
                  title: data.title,
                  thumbnail: data.url,
                  url: data.url,
                  hdUrl: data.hdurl,
                  description: data.explanation,
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
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
