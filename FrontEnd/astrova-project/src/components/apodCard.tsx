import {
  Bookmark,
  BookmarkCheck,
  CalendarIcon,
  Download,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { ApodResponse } from '../services/nasa';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { isSaved, toggleSaved } from '../services/storage';
import { useState } from 'react';

export default function ApodCard(data: ApodResponse) {
  const [saved, setSaved] = useState(isSaved(data.date));
  return (
    <div key={data.date}>
      {/* Hero Image */}
      <div className="group relative mb-6 rounded-2xl md:overflow-hidden">
        {data?.media_type === 'image' ? (
          <div className="relative">
            <img
              src={data?.url}
              alt={data?.title}
              className="h-auto min-h-100 w-full object-cover md:min-h-150"
            />
            {/* Dark overlay gradient */}
            <div className="from-background via-background/50 absolute inset-0 bg-linear-to-t to-transparent opacity-80" />

            {/* Title overlay */}
            <div className="absolute right-0 bottom-0 left-0 p-8 md:p-12">
              <div className="text-cyan mb-3 flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4" />
                <span>{data?.date}</span>
              </div>
              <h2 className="text-soft-white mb-4 text-3xl font-bold md:text-5xl">
                {data?.title}
              </h2>
              {data?.copyright && (
                <p className="text-muted-foreground text-sm">
                  © {data?.copyright}
                </p>
              )}
            </div>

            {/* Download button on hover */}

            <div className="absolute -top-9 right-6 opacity-100 transition-opacity group-hover:opacity-100 md:top-6 md:opacity-0">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-cyan/90 hover:bg-cyan text-background group/btn gap-0 shadow-lg backdrop-blur-sm"
                  asChild
                >
                  <a
                    href={data?.hdurl || data?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overflow-hidden"
                  >
                    <Download className="h-4 w-4" />
                    <span className="ml-0 w-0 translate-x-110 transition-all duration-300 ease-in-out group-hover/btn:ml-2 group-hover/btn:w-auto group-hover/btn:translate-x-0">
                      HD Image
                    </span>
                  </a>
                </Button>
                <Button
                  size="sm"
                  className="bg-cyan/90 hover:bg-cyan text-background group/btn gap-0 overflow-hidden shadow-lg backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const item = {
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
                    setSaved(toggleSaved(item));
                  }}
                >
                  {saved ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  <span className="ml-0 w-0 translate-x-110 transition-all duration-300 ease-in-out group-hover/btn:ml-2 group-hover/btn:w-auto group-hover/btn:translate-x-0">
                    {saved ? 'Saved' : 'Save'}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-background relative aspect-video rounded-2xl md:overflow-hidden">
            <video
              src={data?.url}
              title={data?.title}
              className="aspect-video w-full rounded-xl"
              controls
              autoPlay
              loop
              muted
            />
            <div className="absolute -top-9 right-6 opacity-100 transition-opacity group-hover:opacity-100 md:top-6 md:opacity-0">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-cyan/90 hover:bg-cyan text-background group/btn gap-0 shadow-lg backdrop-blur-sm"
                  asChild
                >
                  <a
                    href={data?.hdurl || data?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overflow-hidden"
                  >
                    <Download className="h-4 w-4" />
                    <span className="ml-0 w-0 translate-x-110 transition-all duration-300 ease-in-out group-hover/btn:ml-2 group-hover/btn:w-auto group-hover/btn:translate-x-0">
                      HD Image
                    </span>
                  </a>
                </Button>
                <Button
                  size="sm"
                  className="bg-cyan/90 hover:bg-cyan text-background group/btn gap-0 overflow-hidden shadow-lg backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const item = {
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
                    setSaved(toggleSaved(item));
                  }}
                >
                  {saved ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  <span className="ml-0 w-0 translate-x-110 transition-all duration-300 ease-in-out group-hover/btn:ml-2 group-hover/btn:w-auto group-hover/btn:translate-x-0">
                    {saved ? 'Saved' : 'Save'}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Description Panel */}
      <Card className="bg-card/50 border-white/5 backdrop-blur-sm">
        <CardHeader>
          <div
            className="group flex cursor-pointer items-center justify-between"
            // onClick={() => setShowDescription(prev => ({ ...prev, [apod.date]: !prev[apod.date] }))}
          >
            <CardTitle className="text-soft-white group-hover:text-cyan text-xl transition-colors">
              Description
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground text-base leading-relaxed">
            {data.explanation}
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-cyan/20 hover:bg-cyan/10 hover:border-cyan/40"
            >
              <a
                href={data.hdurl || data.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Original
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="from-cyan/5 border-cyan/10 mt-6 bg-linear-to-br to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-cyan/20 flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles className="text-cyan h-4 w-4" />
            </div>
            <CardTitle className="text-cyan text-sm">AI Insight</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{data.ai_summary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
