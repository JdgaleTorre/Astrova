import { cn } from './utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'size-8',
  md: 'size-12',
  lg: 'size-16',
};

export function Loading({ className, size = 'md' }: LoadingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className={cn(
          'border-primary animate-spin rounded-full border-4 border-t-transparent',
          sizes[size],
          className,
        )}
      />
    </div>
  );
}
