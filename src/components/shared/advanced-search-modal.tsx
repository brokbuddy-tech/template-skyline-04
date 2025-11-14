'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '../ui/separator';
import { SlidersHorizontal } from 'lucide-react';
import { useState, useMemo } from 'react';
import { properties } from '@/lib/data';

const amenities = [
  'Pool',
  'Private Gym',
  'Ocean View',
  'Rooftop Terrace',
  'Ski-in/Ski-out',
  'Smart Home',
];

export function AdvancedSearchModal() {
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = properties.map(p => p.price);
    const max = Math.max(...prices);
    // Round to nearest 50k
    const roundToNearest50k = (num: number, direction: 'down' | 'up') => {
        if (direction === 'down') {
            return Math.floor(num / 50000) * 50000;
        }
        return Math.ceil(num / 50000) * 50000;
    }
    return { 
        minPrice: 0, 
        maxPrice: roundToNearest50k(max, 'up') 
    };
  }, []);
  
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full md:w-auto rounded-none hover:bg-accent hover:text-accent-foreground border-y border-transparent hover:border-y-input">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advanced
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl font-medium">Advanced Search</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          
          <div>
            <Label htmlFor="ai-search" className="text-base font-bold">AI-Powered Search</Label>
            <p className='text-sm text-muted-foreground mb-2'>Describe your perfect stay...</p>
            <div className='flex gap-2'>
              <Input id="ai-search" placeholder="e.g., 'a 3-bedroom house in Malibu with an ocean view'" className="mt-0 rounded-full" />
              <Button type="submit" className='rounded-full'>Let's Go AI</Button>
            </div>
          </div>

          <div className="flex items-center">
            <Separator className="flex-1" />
            <span className="mx-4 text-sm text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beds">Bedrooms</Label>
              <Input id="beds" type="number" placeholder="Any" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baths">Bathrooms</Label>
              <Input id="baths" type="number" placeholder="Any" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <Label>Price Range</Label>
              <span className='text-sm font-medium'>{formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}{priceRange[1] === maxPrice ? '+' : ''}</span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value)}
              min={minPrice}
              max={maxPrice}
              step={50000}
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
        <DialogFooter className='sm:justify-between'>
            <Button type="button" variant="link">Clear All</Button>
            <Button type="submit" size="lg">Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
