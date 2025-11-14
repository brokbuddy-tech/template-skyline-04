'use client';

import { useState, useEffect, useRef }
from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdvancedSearchModal } from '@/components/shared/advanced-search-modal';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StickySearch() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="Open advanced search"
          className={cn(
            'fixed top-24 right-8 z-30 h-16 w-16 rounded-full bg-accent text-accent-foreground shadow-lg transition-all duration-300 ease-in-out hover:bg-accent/90'
          )}
        >
          <Search className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <AdvancedSearchModal />
    </Dialog>
  );
}