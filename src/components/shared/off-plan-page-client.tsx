'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';
import { PropertyCard } from '@/components/shared/property-card';

export function OffPlanPageClient({
  properties,
  categories,
}: {
  properties: Property[];
  categories: string[];
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const headerImage = PlaceHolderImages.find(image => image.id === 'cta-background');
  const filterOptions = useMemo(
    () => ['All', ...new Set(categories.length > 0 ? categories : properties.map(property => property.type).filter(Boolean))],
    [categories, properties]
  );

  const filteredProperties = properties.filter(property =>
    activeFilter === 'All' || `${property.category || property.type}` === activeFilter
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-headline font-medium">
            Off Plan Projects in Dubai
          </h1>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <div className="relative">
            <div className="flex space-x-2 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none]">
              {filterOptions.map(filter => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {filteredProperties.length === 0 && (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            No off-plan projects matched that filter yet.
          </div>
        )}
      </div>
    </div>
  );
}
