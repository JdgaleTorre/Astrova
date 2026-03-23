import type { SavedItem } from '../types';

const STORAGE_KEY = 'astrova_saved_items';

export const getSavedItems = (): SavedItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveItem = (item: SavedItem): void => {
  const items = getSavedItems();
  const exists = items.some((i) => i.id === item.id);

  if (!exists) {
    items.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

export const removeItem = (id: string): void => {
  const items = getSavedItems().filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const isSaved = (id: string): boolean => {
  return getSavedItems().some((i) => i.id === id);
};

export const toggleSaved = (item: SavedItem): boolean => {
  const saved = isSaved(item.id);
  if (saved) {
    removeItem(item.id);
  } else {
    saveItem(item);
  }
  return !saved;
};
