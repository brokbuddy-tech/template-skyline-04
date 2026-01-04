
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AdvancedSearchModal } from '../shared/advanced-search-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const propertyTypes = ['Apartments', 'Townhouses', 'Penthouses', 'Villas'];
const bedOptions = ['Studio', '1', '2', '3', '4+'];
const bathOptions = ['1', '2', '3', '4+'];

export function StickySearch() {
  const searchParams = useSearchParams();
  const [transactionType, setTransactionType] = useState('Buy');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'rent') {
      setTransactionType('Rent');
    } else {
      setTransactionType('Buy');
    }
  }, [searchParams]);

  return (
    <div className="sticky top-[80px] z-30 w-full bg-background/95 backdrop-blur-sm py-4 border-b">
      <Dialog>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Part A: Location Input */}
            <div className="bg-white rounded-full pl-6 pr-2 py-2 shadow-sm flex items-center flex-1 w-full min-w-0">
              <input
                type="text"
                placeholder="Community or Building..."
                className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400 min-w-0"
              />
              <button className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-all cursor-pointer flex-shrink-0">
                <Plus size={20} />
              </button>
            </div>

            {/* Part B: Quick Filters */}
            <div className="grid grid-cols-2 md:flex md:flex-row gap-3 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline-light"
                    className="bg-white rounded-full px-4 md:px-6 py-3 flex items-center gap-2 text-gray-800 font-medium cursor-pointer transition shadow-sm w-full justify-between"
                  >
                    {transactionType} <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setTransactionType('Buy')}>Buy</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setTransactionType('Rent')}>Rent</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline-light"
                    className="bg-white rounded-full px-4 md:px-6 py-3 flex items-center gap-2 text-gray-800 font-medium cursor-pointer transition shadow-sm w-full justify-between"
                  >
                    Type <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {propertyTypes.map((type) => (
                    <DropdownMenuItem key={type}>{type}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline-light"
                    className="bg-white rounded-full px-4 md:px-6 py-3 flex items-center gap-2 text-gray-800 font-medium cursor-pointer transition shadow-sm w-full justify-between"
                  >
                    Beds <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {bedOptions.map((beds) => (
                    <DropdownMenuItem key={beds}>{beds}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline-light"
                    className="bg-white rounded-full px-4 md:px-6 py-3 flex items-center gap-2 text-gray-800 font-medium cursor-pointer transition shadow-sm w-full justify-between"
                  >
                    Bath <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {bathOptions.map((baths) => (
                    <DropdownMenuItem key={baths}>{baths}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Part C: Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
              <Button
                size="icon"
                className="w-14 h-14 bg-[#1E3A8A] rounded-full text-white shadow-md hover:scale-105 transition-transform"
                aria-label="Search"
              >
                <Search size={24} />
              </Button>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-14 h-14 bg-white rounded-full text-[#1E3A8A] shadow-md hover:bg-gray-100 transition"
                  aria-label="Advanced Filters"
                >
                  <SlidersHorizontal size={24} />
                </Button>
              </DialogTrigger>
            </div>
          </div>
        </div>
        <AdvancedSearchModal />
      </Dialog>
    </div>
  );
}
