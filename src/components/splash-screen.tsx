'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './logo';

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
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-400',
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <Logo />
      <div className="mt-5 w-[200px] h-[2px] bg-[#EAEAEA] rounded-full overflow-hidden">
        <div className="h-full bg-accent animate-load-in"></div>
      </div>
    </div>
  );
}
