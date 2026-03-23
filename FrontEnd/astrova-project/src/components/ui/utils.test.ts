import { describe, it, expect } from '@jest/globals';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges class names', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('handles undefined and empty values', () => {
    const result = cn('text-red-500', undefined, '', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn(
      'base-class',
      isActive && 'active-class',
      !isActive && 'inactive-class',
    );
    expect(result).toBe('base-class active-class');
  });

  it('handles tailwind-merge deduplication', () => {
    const result = cn('text-red-500 text-blue-500');
    expect(result).toBe('text-blue-500');
  });
});
