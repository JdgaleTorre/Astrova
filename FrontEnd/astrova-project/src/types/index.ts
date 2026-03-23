export interface SavedItem {
    id: string;
    type: 'apod' | 'library';
    date: string;
    title: string;
    thumbnail: string;
    url: string;
    hdUrl?: string;
    description?: string;
    savedAt: string;
}