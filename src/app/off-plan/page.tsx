
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { properties } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';
import { PropertyCard } from '@/components/shared/property-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const filterOptions = ['Townhouse', 'Apartment', 'Villa', 'Office Space', 'Hotel Apartment', 'Duplex', 'Penthouse', 'Retail'];

export default function OffPlanPage() {
  const [activeFilter, setActiveFilter] = useState('Apartment');
  
  const headerImage = PlaceHolderImages.find((img) => img.id === 'cta-background');
  const offPlanProperties = properties.filter((p) => p.status === 'Off-plan');

  const filteredProperties = offPlanProperties.filter(property => 
    activeFilter === 'All' || property.type === activeFilter
  );

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen">
      <section className="relative py-24 md:py-32 bg-background text-white">
        {headerImage && (
            <Image 
                src={headerImage.imageUrl}
                alt={headerImage.description}
                fill
                className="object-cover"
                data-ai-hint={headerImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-headline font-medium">
            Off Plan Projects for Buy
          </h1>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-6 py-12">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property as Property} />
          ))}
        </div>
      </div>
    </div>
  );
}
