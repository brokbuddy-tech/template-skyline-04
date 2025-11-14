'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '../ui/separator';

const amenities = [
  'Pool',
  'Private Gym',
  'Ocean View',
  'Rooftop Terrace',
  'Ski-in/Ski-out',
  'Smart Home',
];

export function AdvancedSearchModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto bg-background">Advanced</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl font-medium">Advanced Search</DialogTitle>
          <DialogDescription>
            Use our AI search or refine with detailed filters.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          
          <div>
            <Label htmlFor="ai-search" className="text-base">Intelligent AI Search</Label>
            <Input id="ai-search" placeholder="e.g., 'a 3-bedroom house in Malibu with an ocean view'" className="mt-2" />
          </div>

          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beds">Beds</Label>
              <Input id="beds" type="number" placeholder="Any" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baths">Baths</Label>
              <Input id="baths" type="number" placeholder="Any" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$500,000</span>
              <span>$10,000,000+</span>
            </div>
            <Slider
              defaultValue={[2500000, 7500000]}
              min={500000}
              max={10000000}
              step={100000}
              className="mt-2"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox id={amenity} />
                  <Label htmlFor={amenity} className="font-normal">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" size="lg" className="w-full">Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
