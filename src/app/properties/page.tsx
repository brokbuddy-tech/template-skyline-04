
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { PropertyCard } from "@/components/shared/property-card";
import { properties } from "@/lib/data";
import { StickySearch } from '@/components/shared/sticky-search';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const PROPERTIES_PER_PAGE = 6;

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [visibleProperties, setVisibleProperties] = useState(PROPERTIES_PER_PAGE);
  
  const headerImage = PlaceHolderImages.find((img) => img.id === 'cta-background');

  const pageType = searchParams.get('type');
  const title = pageType === 'rent' ? 'Properties for Rent' : pageType === 'buy' ? 'Properties for Sale' : 'Our Properties';

  const filteredProperties = properties.filter(property => {
    if (!pageType) return true;
    if (pageType === 'rent') return property.transactionType === 'Rent';
    if (pageType === 'buy') return property.transactionType === 'Sale';
    return true;
  });

  const handleLoadMore = () => {
    setVisibleProperties((prev) => prev + PROPERTIES_PER_PAGE);
  };

  const propertiesToShow = filteredProperties.slice(0, visibleProperties);
  const canLoadMore = visibleProperties < filteredProperties.length;


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
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-headline font-medium">{title}</h1>
        </div>
      </section>
      
      <StickySearch />

      <section className="py-16 bg-background pt-8 md:pt-16">
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
