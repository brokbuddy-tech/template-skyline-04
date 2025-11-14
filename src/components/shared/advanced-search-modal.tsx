'use client'

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '../ui/separator';
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
    const roundToNearest50k = (num: number) => {
        return Math.ceil(num / 50000) * 50000;
    }
    return { 
        minPrice: 0,
        maxPrice: roundToNearest50k(max)
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
    <DialogContent className="sm:max-w-2xl bg-background text-foreground border-foreground/20">
      <DialogHeader>
        <DialogTitle className="font-headline text-3xl font-medium">Advanced Search</DialogTitle>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        
        <div>
          <Label htmlFor="ai-search" className="text-base font-bold">AI-Powered Search</Label>
          <p className='text-sm text-muted-foreground mb-2'>Describe your perfect stay...</p>
          <div className='flex gap-2'>
            <Input id="ai-search" placeholder="e.g., 'a 3-bedroom house in Malibu with an ocean view'" className="mt-0 rounded-full border-primary focus-visible:ring-primary" />
            <Button type="submit" className='rounded-full bg-primary text-primary-foreground'>Let's Go AI</Button>
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
            <Input id="beds" type="number" placeholder="Any" className="border-primary focus-visible:ring-primary"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="baths">Bathrooms</Label>
            <Input id="baths" type="number" placeholder="Any" className="border-primary focus-visible:ring-primary"/>
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
            className="mt-2 [&>span:last-child]:bg-primary [&>div]:bg-primary"
          />
        </div>
        
        <div className="space-y-4">
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox id={amenity} className="border-primary data-[state=checked]:bg-primary"/>
                <Label htmlFor={amenity} className="font-normal">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter className='sm:justify-between'>
          <Button type="button" variant="link" className="text-primary">Clear All</Button>
          <Button type="submit" size="lg" className="bg-primary text-primary-foreground">Apply Filters</Button>
      </DialogFooter>
    </DialogContent>
  );
}