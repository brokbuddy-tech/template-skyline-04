'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { StickySearch } from '@/components/shared/sticky-search';
import { PropertyCard } from '@/components/shared/property-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Property } from '@/lib/types';

const PROPERTIES_PER_PAGE = 6;

export function PropertiesPageClient({
  title,
  properties,
  categories,
  amenities,
}: {
  title: string;
  properties: Property[];
  categories: string[];
  amenities: string[];
}) {
  const [visibleProperties, setVisibleProperties] = useState(PROPERTIES_PER_PAGE);
  const headerImage = PlaceHolderImages.find(image => image.id === 'cta-background');
  const propertiesToShow = properties.slice(0, visibleProperties);
  const canLoadMore = visibleProperties < properties.length;

  return (
    <>
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
        <div className="container mx-auto text-right md:text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-headline font-medium">{title}</h1>
        </div>
      </section>

      <StickySearch categories={categories} amenities={amenities} />

      <section className="py-16 bg-background pt-8 md:pt-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {propertiesToShow.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          {propertiesToShow.length === 0 && (
            <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
              No properties matched those filters yet.
            </div>
          )}
          {canLoadMore && (
            <div className="text-center mt-16">
              <Button size="lg" onClick={() => setVisibleProperties(previous => previous + PROPERTIES_PER_PAGE)}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
