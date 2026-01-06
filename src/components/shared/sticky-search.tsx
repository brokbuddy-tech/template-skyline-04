
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AdvancedSearchModal } from '../shared/advanced-search-modal';
import { cn } from '@/lib/utils';

export function StickySearch() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); 
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn(
      "sticky top-[80px] z-30 w-full bg-background/95 backdrop-blur-sm transition-all duration-300",
      isScrolled ? 'py-2 border-b' : 'py-4'
    )}>
      <Dialog>
        <div className="container mx-auto">
          <div className="flex flex-row items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Dubai..."
                className="bg-white dark:bg-black w-full h-14 rounded-full pl-12 pr-4 shadow-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            
            {/* Filter Trigger */}
            <DialogTrigger asChild>
               <Button
                  size="icon"
                  variant="secondary"
                  className="w-14 h-14 bg-white dark:bg-black rounded-full text-accent shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-shrink-0"
                  aria-label="Advanced Filters"
                >
                  <SlidersHorizontal className="w-6 h-6" />
                </Button>
            </DialogTrigger>
          </div>
        </div>
        <AdvancedSearchModal />
      </Dialog>
    </div>
  );
}
