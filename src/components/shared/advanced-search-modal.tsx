
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
import { type ChangeEvent, type Dispatch, type SetStateAction, useContext, useMemo, useState } from 'react';
import { CurrencyContext } from '@/context/currency-context';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { searchPropertiesWithAI } from '@/lib/api';
import { prefixAgencyPath, resolveAgencySlugFromPathname, stripAgencySlugFromPathname } from '@/lib/agency-routing';

const fallbackAmenities = [
  'Pool',
  'Private Gym',
  'Ocean View',
  'Rooftop Terrace',
  'Ski-in/Ski-out',
  'Smart Home',
];

export function AdvancedSearchModal({ amenities = fallbackAmenities }: { amenities?: string[] }) {
  const { formatPrice } = useContext(CurrencyContext);
  const router = useRouter();
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);
  const normalizedPathname = stripAgencySlugFromPathname(pathname, agencySlug);
  const searchParams = useSearchParams();
  const minPrice = 0;
  const maxPrice = 50000000;
  
  const [aiQuery, setAiQuery] = useState(searchParams.get('q') || '');
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice') || minPrice),
    Number(searchParams.get('maxPrice') || maxPrice),
  ]);
  const [beds, setBeds] = useState(searchParams.get('bedrooms') || '');
  const [baths, setBaths] = useState(searchParams.get('bathrooms') || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isAiSearching, setIsAiSearching] = useState(false);

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  const handleClearAll = () => {
    setAiQuery('');
    setPriceRange([minPrice, maxPrice]);
    setBeds('');
    setBaths('');
    setSelectedAmenities([]);
    router.push(prefixAgencyPath('/properties', agencySlug));
  };

  const handleNumericChange = (setter: Dispatch<SetStateAction<string>>) => (e: ChangeEvent<HTMLInputElement>) => {
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

  const formattedPrice = (value: number) => formatPrice(value, true);

  const applyFilters = async () => {
    const params = new URLSearchParams(searchParams.toString());
    const destination = normalizedPathname === '/properties'
      ? prefixAgencyPath(normalizedPathname, agencySlug)
      : prefixAgencyPath('/properties', agencySlug);

    if (aiQuery.trim()) {
      params.set('q', aiQuery.trim());
      setIsAiSearching(true);
      try {
        const result = await searchPropertiesWithAI({
          query: aiQuery.trim(),
          transactionType: searchParams.get('type') || undefined,
          category: searchParams.get('category') || undefined,
          readiness: searchParams.get('readiness') || undefined,
          limit: 18,
        });

        if (result.propertyIds.length > 0) {
          params.set('ids', result.propertyIds.join(','));
        } else {
          params.delete('ids');
        }
      } catch {
        params.delete('ids');
      } finally {
        setIsAiSearching(false);
      }
    } else {
      params.delete('q');
      params.delete('ids');
    }

    if (beds) params.set('bedrooms', beds);
    else params.delete('bedrooms');

    if (baths) params.set('bathrooms', baths);
    else params.delete('bathrooms');

    if (priceRange[0] > minPrice) params.set('minPrice', String(priceRange[0]));
    else params.delete('minPrice');

    if (priceRange[1] < maxPrice) params.set('maxPrice', String(priceRange[1]));
    else params.delete('maxPrice');

    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
    else params.delete('amenities');

    router.push(`${destination}?${params.toString()}`);
  };

  const visibleAmenities = useMemo(
    () => (amenities.length > 0 ? amenities.slice(0, 9) : fallbackAmenities),
    [amenities]
  );

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
            <Input
              id="ai-search"
              value={aiQuery}
              onChange={(event) => setAiQuery(event.target.value)}
              placeholder="e.g., 'a 3-bedroom apartment in Dubai Marina with a pool'"
              className="mt-0 rounded-full border-accent focus-visible:ring-accent"
            />
            <Button type="button" className='rounded-full' onClick={() => void applyFilters()} disabled={isAiSearching}>
              {isAiSearching ? 'Searching...' : "Let's Go AI"}
            </Button>
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
            {visibleAmenities.map((amenity) => (
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
          <Button type="button" size="lg" onClick={() => void applyFilters()} disabled={isAiSearching}>Apply Filters</Button>
      </DialogFooter>
    </DialogContent>
  );
}
