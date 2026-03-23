export interface SavedItem {
  id: string;
  type: 'apod' | 'library';
  media_type: 'image' | 'video' | 'audio';
  date: string;
  title: string;
  thumbnail: string;
  url: string;
  hdUrl?: string;
  description?: string;
  savedAt: string;
}
