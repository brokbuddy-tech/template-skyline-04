'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AdvancedSearchModal } from '../shared/advanced-search-modal';

const searchTabs = ['Buy', 'Rent', 'Sell', 'Manage'];
const propertyTypes = ['Apartments', 'Townhouses', 'Penthouses', 'Villas', 'Offices'];

export function HeroSearch() {
  const [activeTab, setActiveTab] = useState('Buy');
  const [selectedType, setSelectedType] = useState('Choose Property Type');

  return (
    <Dialog>
      <div className="w-full max-w-5xl mx-auto p-4 z-20">
        {/* Part A: The Category Tabs */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 overflow-x-auto pb-2">
          {searchTabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? 'default' : 'outline'}
              className={cn(
                'rounded-full uppercase font-medium text-sm md:text-base px-6 py-2 transition-all',
                activeTab === tab
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-transparent border-white/50 text-white hover:bg-white/20 hover:text-white'
              )}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Part B: The Search Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-2xl flex flex-col md:flex-row items-center gap-3 w-full">
          {/* Input 1: Property Type Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-gray-100/80 rounded-full px-6 py-4 flex items-center justify-between min-w-[220px] w-full md:w-auto cursor-pointer hover:bg-gray-200 transition">
                <span className="text-gray-700 truncate">{selectedType}</span>
                <ChevronDown className="w-5 h-5 text-accent ml-2" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px] bg-white">
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

          {/* Input 2: Location Search */}
          <input
            type="text"
            placeholder="Community or Building..."
            className="bg-gray-100/80 rounded-full px-6 py-4 flex-1 outline-none text-gray-700 placeholder-gray-500 w-full"
          />

          {/* Input 3: Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Button
              size="icon"
              className="w-14 h-14 bg-accent rounded-full text-white shadow-lg hover:scale-105 transition"
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </Button>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="w-14 h-14 bg-gray-100 rounded-full text-accent hover:bg-gray-200 transition"
                aria-label="Filters"
              >
                <SlidersHorizontal className="w-6 h-6" />
              </Button>
            </DialogTrigger>
          </div>
        </div>
      </div>
      <AdvancedSearchModal />
    </Dialog>
  );
}
