
'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Loader2, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AdvancedSearchModal } from '../shared/advanced-search-modal';
import { usePathname, useRouter } from 'next/navigation';
import { searchPropertiesWithAI } from '@/lib/api';
import { prefixAgencyPath, resolveAgencySlugFromPathname } from '@/lib/agency-routing';
import { cleanQueryForCategoryFilter } from '@/lib/search';

const searchTabs = ['Buy', 'Rent', 'Sell', 'Manage'];
const fallbackPropertyTypes = ['Apartment', 'Townhouse', 'Penthouse', 'Villa', 'Office'];

export function HeroSearch({ categories = [] }: { categories?: string[] }) {
  const [activeTab, setActiveTab] = useState('Buy');
  const [selectedType, setSelectedType] = useState('');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);
  const propertyTypes = useMemo(
    () => (categories.length > 0 ? categories : fallbackPropertyTypes),
    [categories]
  );

  const handleSearch = async () => {
    if (activeTab === 'Sell') {
      router.push(prefixAgencyPath('/sell', agencySlug));
      return;
    }

    if (activeTab === 'Manage') {
      router.push(prefixAgencyPath('/contact', agencySlug));
      return;
    }

    const params = new URLSearchParams();
    params.set('type', activeTab === 'Rent' ? 'rent' : 'buy');

    const category = selectedType || undefined;
    if (category) {
      params.set('category', category);
    }

    const cleanedQuery = cleanQueryForCategoryFilter(query.trim(), category);
    if (cleanedQuery) {
      params.set('q', cleanedQuery);
      setIsSearching(true);
      try {
        const result = await searchPropertiesWithAI({
          query: cleanedQuery,
          transactionType: activeTab === 'Rent' ? 'rent' : 'buy',
          category,
          limit: 12,
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
      params.delete('ids');
    }

    router.push(prefixAgencyPath(`/properties?${params.toString()}`, agencySlug));
  };

  const renderTab = (tab: string) => {
    const isActive = activeTab === tab;
    
    // Mobile button styles
    const mobileButtonClasses = cn(
      'rounded-full uppercase font-bold text-xs px-3 py-2 shadow-md transition-colors duration-200 whitespace-nowrap',
      isActive
        ? 'bg-[#1E1E2C] text-white'
        : 'bg-white text-black'
    );

    // Desktop button styles
    const desktopButtonClasses = cn(
      'rounded-full uppercase font-medium text-sm md:text-base px-6 py-2 transition-all',
      isActive
        ? 'bg-white text-black hover:bg-gray-200'
        : 'bg-transparent border-white/50 text-white hover:bg-white/20 hover:text-white'
    );

    const buttonContent = (
      <>
        {/* Mobile Button */}
        <div className={cn('md:hidden', mobileButtonClasses)}>
          {tab}
        </div>
        {/* Desktop Button */}
        <div className={cn('hidden md:block', desktopButtonClasses)}>
          {tab}
        </div>
      </>
    );

    const buttonWrapper = (
      <button onClick={() => setActiveTab(tab)} className="md:border-0 md:bg-transparent md:p-0" type="button">
        {buttonContent}
      </button>
    );

    return <div key={tab}>{buttonWrapper}</div>;
  }

  return (
    <Dialog>
      <div className="w-full max-w-sm md:max-w-5xl mx-auto md:p-4 z-20">
        {/* Container for both mobile and desktop layouts */}
        <div className="flex flex-col md:flex-col gap-3 w-full px-4 md:px-0">
          
          {/* Mobile and Desktop Tabs */}
          <div className="flex items-center justify-center gap-2 md:gap-4 md:mb-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none]">
            {searchTabs.map(renderTab)}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full p-2 shadow-2xl items-center gap-3 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-full px-6 py-4 flex items-center justify-between min-w-[220px] w-auto cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <span className="text-gray-700 dark:text-gray-200 truncate">{selectedType || 'Choose Property Type'}</span>
                  <ChevronDown className="w-5 h-5 text-accent ml-2" />
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

            <input
              type="text"
              placeholder="Community or Building..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSearch();
              }}
              className="bg-gray-100/80 dark:bg-gray-800/80 rounded-full px-6 py-4 flex-1 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 w-full"
            />

            <div className="flex items-center gap-3 w-auto justify-end">
              <Button
                size="icon"
                className="w-14 h-14 bg-accent rounded-full text-white shadow-lg hover:scale-105 transition"
                aria-label="Search"
                onClick={() => void handleSearch()}
                disabled={isSearching}
              >
                {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              </Button>
              <Button
                className="h-14 rounded-full bg-gray-100 px-5 text-sm font-semibold text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                onClick={() => void handleSearch()}
                disabled={isSearching || !query.trim()}
              >
                <Sparkles className="mr-2 h-4 w-4 text-accent" />
                AI Search
              </Button>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full text-accent hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label="Filters"
                >
                  <SlidersHorizontal className="w-6 h-6" />
                </Button>
              </DialogTrigger>
            </div>
          </div>
          
          {/* Mobile Search Rows */}
          <div className="md:hidden flex flex-col gap-3 w-full max-w-[calc(100vw-2rem)] mx-auto">
            {/* Row 2: Property Type Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-full bg-white dark:bg-black rounded-full h-14 flex items-center px-4 shadow-lg">
                  <span className="text-black dark:text-white font-medium text-sm truncate">{selectedType}</span>
                  <ChevronDown className="w-5 h-5 text-accent ml-auto flex-shrink-0" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(100vw-2rem)]">
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

            {/* Row 3: Search Input & Actions */}
            <div className="w-full bg-white dark:bg-black rounded-full h-14 flex items-center pl-4 pr-2 shadow-lg">
              <input
                type="text"
                placeholder="Community or Building..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleSearch();
                  }
                }}
                className="flex-1 outline-none text-gray-600 dark:text-gray-300 placeholder-gray-400 bg-transparent min-w-0 text-sm"
              />
              <Button
                size="icon"
                className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white ml-2 flex-shrink-0"
                onClick={() => void handleSearch()}
                disabled={isSearching}
              >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-accent ml-2 flex-shrink-0"
                onClick={() => void handleSearch()}
                disabled={isSearching || !query.trim()}
                aria-label="AI Search"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-accent ml-2 flex-shrink-0">
                    <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </DialogTrigger>
            </div>
          </div>

        </div>
      </div>
      <AdvancedSearchModal amenities={[]} />
    </Dialog>
  );
}
