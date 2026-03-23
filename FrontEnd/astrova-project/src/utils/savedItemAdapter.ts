import type { SavedItem } from '../types';
import type { ApodResponse } from '../services/nasa';
import type { MediaAsset } from '../services/nasa';

export function adaptToApodResponse(item: SavedItem): ApodResponse {
  return {
    date: item.id,
    title: item.title,
    url: item.url,
    hdurl: item.hdUrl || item.url,
    media_type: item.media_type === 'audio' ? 'video' : item.media_type,
    explanation: item.description || '',
    copyright: undefined,
    ai_summary: '',
  };
}

export function adaptToMediaAsset(item: SavedItem): MediaAsset {
  return {
    data: [
      {
        nasa_id: item.id,
        title: item.title,
        description: item.description || '',
        media_type: item.media_type,
        date_created: item.date,
        photographer: undefined,
      },
    ],
    href: item.url,
    links: item.thumbnail
      ? [{ href: item.thumbnail, rel: 'preview', render: 'image' }]
      : [],
  };
}
