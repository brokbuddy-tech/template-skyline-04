'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowUpRight } from 'lucide-react';
import { CurrencyContext } from '@/context/currency-context';


interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === property.images[0]);
  const { formatPrice } = useContext(CurrencyContext);


  return (
    <div className="group" data-hoverable="true">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg">
          {image && (
            <Image
              src={image.imageUrl}
              alt={property.title}
              width={800}
              height={1000} // Adjusted for 4:5 aspect ratio
              className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-500"
              data-ai-hint={image.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
          
          {/* Arrow Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 scale-80 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out">
              <ArrowUpRight size={48} />
          </div>
        </div>
      </Link>
      
      <div className="pt-4">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-headline font-bold">{property.title}</h3>
            <p className="text-xl font-headline font-bold convert-price" data-usd-price={property.price}>{formatPrice(property.price)}</p>
        </div>
        <p className="text-sm text-muted-foreground">{property.location}</p>
      </div>
    </div>
  );
}
