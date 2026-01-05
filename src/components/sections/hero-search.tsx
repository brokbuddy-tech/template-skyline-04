
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
import Link from 'next/link';

const searchTabs = ['Buy', 'Rent', 'Sell', 'Manage'];
const propertyTypes = ['Apartments', 'Townhouses', 'Penthouses', 'Villas', 'Offices'];

export function HeroSearch() {
  const [activeTab, setActiveTab] = useState('Buy');
  const [selectedType, setSelectedType] = useState('Choose Property Type');

  const renderTab = (tab: string) => {
    const isActive = activeTab === tab;
    
    // Mobile button styles
    const mobileButtonClasses = cn(
      'rounded-full uppercase font-bold text-sm px-6 py-2 shadow-md transition-colors duration-200 whitespace-nowrap',
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
      <button onClick={() => setActiveTab(tab)} className="md:border-0 md:bg-transparent md:p-0">
        {buttonContent}
      </button>
    );

    if (tab === 'Buy') {
        return (
            <Link key={tab} href="/properties?type=buy" passHref legacyBehavior>
                {buttonWrapper}
            </Link>
        )
    }

    if (tab === 'Rent') {
        return (
            <Link key={tab} href="/properties?type=rent" passHref legacyBehavior>
                {buttonWrapper}
            </Link>
        )
    }

    return <div key={tab}>{buttonWrapper}</div>;
  }

  return (
    <Dialog>
      <div className="w-full max-w-5xl mx-auto md:p-4 z-20">
        {/* Container for both mobile and desktop layouts */}
        <div className="flex flex-col md:flex-col gap-3 w-full px-4 md:px-0">
          
          {/* Mobile and Desktop Tabs */}
          <div className="flex items-center justify-center gap-2 md:gap-4 md:mb-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none]">
            {searchTabs.map(renderTab)}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-2xl items-center gap-3 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-gray-100/80 rounded-full px-6 py-4 flex items-center justify-between min-w-[220px] w-auto cursor-pointer hover:bg-gray-200 transition">
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

            <input
              type="text"
              placeholder="Community or Building..."
              className="bg-gray-100/80 rounded-full px-6 py-4 flex-1 outline-none text-gray-700 placeholder-gray-500 w-full"
            />

            <div className="flex items-center gap-3 w-auto justify-end">
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
          
          {/* Mobile Search Rows */}
          <div className="md:hidden flex flex-col gap-3 w-full">
            {/* Row 2: Property Type Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-full bg-white rounded-full h-[60px] flex items-center px-6 shadow-lg">
                  <span className="text-black font-medium">{selectedType}</span>
                  <ChevronDown className="w-5 h-5 text-blue-800 ml-auto" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(100vw-2rem)] bg-white">
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
            <div className="w-full bg-white rounded-full h-[60px] flex items-center pl-6 pr-2 shadow-lg">
              <input
                type="text"
                placeholder="Community or Building..."
                className="flex-1 outline-none text-gray-600 placeholder-gray-400 bg-transparent"
              />
              <Button size="icon" className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white ml-2 flex-shrink-0">
                  <Search className="w-5 h-5" />
              </Button>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#1E3A8A] ml-2 flex-shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </DialogTrigger>
            </div>
          </div>

        </div>
      </div>
      <AdvancedSearchModal />
    </Dialog>
  );
}
