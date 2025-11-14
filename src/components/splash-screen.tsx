'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from './shared/loading-spinner';
import { cn } from '@/lib/utils';

export function SplashScreen({ isLoading }: { isLoading: boolean }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 0); // Start fade-out immediately when loading is done
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isLoading]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-400',
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <LoadingSpinner />
    </div>
  );
}
