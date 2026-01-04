'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { properties } from '@/lib/data';
import { OffPlanPropertyCard } from '@/components/shared/off-plan-property-card';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';

const filterOptions = ['Townhouse', 'Apartment', 'Villa', 'Office Space', 'Hotel Apartment', 'Duplex', 'Penthouse', 'Retail'];

export default function OffPlanPage() {
  const [activeFilter, setActiveFilter] = useState('Apartment');
  
  const offPlanProperties = properties.filter((p) => p.status === 'Off-plan');

  const filteredProperties = offPlanProperties.filter(property => 
    activeFilter === 'All' || property.type === activeFilter
  );

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E1E2C] dark:text-white">
            Off Plan Projects for Buy
          </h1>
          <Button className="hidden md:inline-flex bg-[#1E1E2C] hover:bg-[#1E1E2C]/90 text-white rounded-full">
            Explore Off Plan Properties
          </Button>
        </header>

        {/* Filter Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="flex space-x-2 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none]">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    'px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors duration-200',
                    activeFilter === filter
                      ? 'bg-[#1E1E2C] text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <OffPlanPropertyCard key={property.id} property={property as Property} />
          ))}
        </div>
      </div>
    </div>
  );
}
