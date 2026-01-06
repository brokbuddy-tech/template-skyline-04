
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
import { useState, useMemo, useContext } from 'react';
import { properties } from '@/lib/data';
import { CurrencyContext } from '@/context/currency-context';

const allAmenities = [
  'Pool',
  'Private Gym',
  'Ocean View',
  'Rooftop Terrace',
  'Ski-in/Ski-out',
  'Smart Home',
];

export function AdvancedSearchModal() {
  const { currency, formatPrice, convertFromUSD } = useContext(CurrencyContext);

  const { minPrice, maxPrice } = useMemo(() => {
    const prices = properties.map(p => convertFromUSD(p.price));
    const max = Math.max(...prices);
    const roundToNearest = (num: number, nearest: number) => {
        return Math.ceil(num / nearest) * nearest;
    }
    const roundingFactor = max > 500000 ? 50000 : 10000;
    return {
        minPrice: 0,
        maxPrice: roundToNearest(max, roundingFactor)
    };
  }, [convertFromUSD]);
  
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useMemo(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  const handleClearAll = () => {
    setPriceRange([minPrice, maxPrice]);
    setBeds('');
    setBaths('');
    setSelectedAmenities([]);
  };

  const handleNumericChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setter('');
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      if (num < 0) {
        setter('0');
      } else if (num > 999) {
        setter('999');
      } else {
        setter(num.toString());
      }
    }
  };

  const formattedPrice = (value: number) => {
    const rate = useContext(CurrencyContext).rates[currency] || 1;
    const price = value / rate;
    return formatPrice(price, true);
  }

  return (
    <DialogContent className="p-0 sm:max-w-md bg-background text-foreground border-foreground/20 flex flex-col max-h-[90vh] sm:h-auto">
      <DialogHeader className='p-4 border-b'>
        <DialogTitle className="font-headline text-xl font-medium">Advanced Search</DialogTitle>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <Label htmlFor="ai-search" className="text-base font-bold">AI-Powered Search</Label>
          <p className='text-sm text-muted-foreground mb-2'>Describe your perfect stay...</p>
          <div className='flex gap-2'>
            <Input id="ai-search" placeholder="e.g., 'a 3-bedroom house in Malibu with an ocean view'" className="mt-0 rounded-full border-accent focus-visible:ring-accent" />
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
            <Input id="beds" type="number" placeholder="Any" value={beds} onChange={handleNumericChange(setBeds)} className="border-accent focus-visible:ring-accent"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="baths">Bathrooms</Label>
            <Input id="baths" type="number" placeholder="Any" value={baths} onChange={handleNumericChange(setBaths)} className="border-accent focus-visible:ring-accent"/>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <Label>Price Range</Label>
            <span className='text-sm font-medium'>
                {formattedPrice(priceRange[0])} - {formattedPrice(priceRange[1])}{priceRange[1] === maxPrice ? '+' : ''}
            </span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value)}
            min={minPrice}
            max={maxPrice}
            step={maxPrice / 100}
            className="mt-2 [&>span:first-child>span]:bg-accent [&>span:last-child>span]:bg-accent [&>[role=slider]]:bg-accent"
          />
        </div>
        
        <div className="space-y-4">
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {allAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox 
                  id={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityChange(amenity)}
                  className="border-accent data-[state=checked]:bg-accent"
                />
                <Label htmlFor={amenity} className="font-normal">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <DialogFooter className='p-4 border-t sm:justify-between'>
          <Button type="button" variant="link" className="text-accent" onClick={handleClearAll}>Clear All</Button>
          <Button type="submit" size="lg">Apply Filters</Button>
      </DialogFooter>
    </DialogContent>
  );
}
