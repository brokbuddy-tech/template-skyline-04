'use client';

import { useState } from 'react';
import { PropertyCard } from "@/components/shared/property-card";
import { properties } from "@/lib/data";
import { StickySearch } from '@/components/shared/sticky-search';
import { Button } from '@/components/ui/button';

const PROPERTIES_PER_PAGE = 6;

export default function PropertiesPage() {
  const [visibleProperties, setVisibleProperties] = useState(PROPERTIES_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleProperties((prev) => prev + PROPERTIES_PER_PAGE);
  };

  const propertiesToShow = properties.slice(0, visibleProperties);
  const canLoadMore = visibleProperties < properties.length;

  return (
    <>
      <section className="pt-24 pb-16 bg-background">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-headline font-medium">Our Properties</h1>
        </div>
      </section>
      
      <StickySearch />

      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {propertiesToShow.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          {canLoadMore && (
            <div className="text-center mt-16">
              <Button size="lg" onClick={handleLoadMore}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
