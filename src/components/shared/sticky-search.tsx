
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AdvancedSearchModal } from '../shared/advanced-search-modal';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { searchPropertiesWithAI } from '@/lib/api';
import { cleanQueryForCategoryFilter } from '@/lib/search';

const fallbackPropertyTypes = ['Apartment', 'Townhouse', 'Penthouse', 'Villa', 'Office'];
const completionStatus = ['Any', 'Ready', 'Off-plan'];

export function StickySearch({ categories = [], amenities = [] }: { categories?: string[]; amenities?: string[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchKey = searchParams.toString();
  const initialSelectedType = searchParams.get('category') || searchParams.get('propertyType') || '';
  const [transactionType, setTransactionType] = useState(searchParams.get('type') || 'buy');
  const [selectedType, setSelectedType] = useState(initialSelectedType);
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('readiness') || '');
  const [query, setQuery] = useState(cleanQueryForCategoryFilter(searchParams.get('q'), initialSelectedType) || '');
  const [isSearching, setIsSearching] = useState(false);
  const propertyTypes = useMemo(
    () => (categories.length > 0 ? categories : fallbackPropertyTypes),
    [categories]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); 
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const nextSelectedType = searchParams.get('category') || searchParams.get('propertyType') || '';
    setTransactionType(searchParams.get('type') || 'buy');
    setSelectedType(nextSelectedType);
    setSelectedStatus(searchParams.get('readiness') || '');
    setQuery(cleanQueryForCategoryFilter(searchParams.get('q'), nextSelectedType) || '');
  }, [searchKey]);

  const pushSearch = async (nextTransactionType = transactionType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('type', nextTransactionType);
    const category = selectedType || undefined;
    const cleanedQuery = cleanQueryForCategoryFilter(query.trim(), category);

    if (cleanedQuery) {
      params.set('q', cleanedQuery);
      setIsSearching(true);
      try {
        const result = await searchPropertiesWithAI({
          query: cleanedQuery,
          transactionType: nextTransactionType,
          category,
          readiness: selectedStatus || undefined,
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
        setIsSearching(false);
      }
    } else {
      params.delete('q');
      params.delete('ids');
    }

    if (category) params.set('category', category);
    else params.delete('category');

    if (selectedStatus && selectedStatus !== 'Any') params.set('readiness', selectedStatus);
    else params.delete('readiness');

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTransactionTypeChange = (value: string) => {
    if (!value) return;
    setTransactionType(value);
    void pushSearch(value);
  };


  return (
    <div className={cn(
      "sticky top-[80px] z-30 w-full bg-background/95 backdrop-blur-sm transition-all duration-300",
      isScrolled ? 'py-2 border-b' : 'py-4'
    )}>
      <Dialog>
        <div className="container mx-auto">
           {/* Mobile Search Bar */}
          <div className="md:hidden flex flex-row items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Dubai..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void pushSearch();
                }}
                className="bg-white dark:bg-black w-full h-14 rounded-full pl-12 pr-4 shadow-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            
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

          {/* Desktop Search Bar */}
          <div className="hidden md:flex bg-white dark:bg-black rounded-full p-2 shadow-lg items-center gap-2 border w-full">
            <ToggleGroup 
              type="single" 
              value={transactionType} 
              onValueChange={handleTransactionTypeChange}
              className="p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-full ml-2"
            >
              <ToggleGroupItem value="buy" className="px-4 py-2 text-sm rounded-full data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-sm">Buy</ToggleGroupItem>
              <ToggleGroupItem value="rent" className="px-4 py-2 text-sm rounded-full data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-sm">Rent</ToggleGroupItem>
            </ToggleGroup>
            
            <input
              type="text"
              placeholder="Enter keywords..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void pushSearch();
              }}
              className="bg-transparent rounded-full px-6 py-4 flex-1 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 w-full focus:ring-0 border-0"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-full px-4 py-4 flex items-center justify-between min-w-[180px] w-auto cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <span className="text-gray-700 dark:text-gray-200 truncate text-sm">{selectedType || 'Property Type'}</span>
                  <ChevronDown className="w-4 h-4 text-accent ml-2" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[220px]">
                {propertyTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onSelect={() => setSelectedType(type)}
                    className="cursor-pointer"
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-full px-4 py-4 flex items-center justify-between min-w-[180px] w-auto cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <span className="text-gray-700 dark:text-gray-200 truncate text-sm">{selectedStatus || 'Completion Status'}</span>
                  <ChevronDown className="w-4 h-4 text-accent ml-2" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[220px]">
                {completionStatus.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onSelect={() => setSelectedStatus(status)}
                    className="cursor-pointer"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2 w-auto justify-end">
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="h-14 bg-gray-100 dark:bg-gray-800 rounded-full text-accent hover:bg-gray-200 dark:hover:bg-gray-700 transition px-4"
                  aria-label="Filters"
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  <span className='text-sm'>All Filters</span>
                </Button>
              </DialogTrigger>
              <Button
                className="h-14 bg-accent rounded-full text-white shadow-lg hover:scale-105 transition px-6"
                aria-label="Search"
                onClick={() => void pushSearch()}
                disabled={isSearching}
              >
                {isSearching ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Search className="w-5 h-5 mr-2" />}
                 <span className='text-sm font-bold'>Find</span>
              </Button>
            </div>
          </div>
        </div>
        <AdvancedSearchModal amenities={amenities} />
      </Dialog>
    </div>
  );
}
