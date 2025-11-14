'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdvancedSearchModal } from '@/components/shared/advanced-search-modal';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StickySearch() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // We target the footer by its ID. Make sure the footer has id="main-footer"
    footerRef.current = document.getElementById('main-footer');

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={cn(
            'fixed top-24 right-5 z-40 h-16 w-16 rounded-full bg-accent text-accent-foreground shadow-lg transition-all duration-500 ease-in-out',
            isFooterVisible
              ? 'opacity-0 scale-80 -translate-y-10'
              : 'opacity-100 scale-100 translate-y-0'
          )}
          aria-label="Open advanced search"
          style={{pointerEvents: isFooterVisible ? 'none' : 'auto'}}
        >
          <Search className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <AdvancedSearchModal />
    </Dialog>
  );
}
