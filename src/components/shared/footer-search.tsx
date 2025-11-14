'use client';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AdvancedSearchModal } from '@/components/shared/advanced-search-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FooterSearch() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group w-full max-w-2xl mx-auto cursor-pointer">
          <div className="flex items-center gap-0 p-2 border border-primary-foreground/50 rounded-full bg-transparent hover:bg-black/20 transition-colors">
            <Input 
              placeholder="Search by Location, Amenity, Type..." 
              className="bg-transparent border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground text-primary-foreground h-auto text-lg flex-grow pl-4"
              readOnly
            />
            <Button size="lg" className="rounded-full bg-accent text-accent-foreground flex-shrink-0">Search</Button>
          </div>
        </div>
      </DialogTrigger>
      <AdvancedSearchModal />
    </Dialog>
  );
}
