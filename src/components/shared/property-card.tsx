import Link from 'next/link';
import Image from 'next/image';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BedDouble, Bath, Square, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === property.images[0]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/properties/${property.id}`} className="group block" data-hoverable="true">
      <div className="relative overflow-hidden rounded-lg mb-4">
        {image && (
          <Image
            src={image.imageUrl}
            alt={property.title}
            width={800}
            height={600}
            className="w-full h-auto object-cover aspect-[4/3]"
            data-ai-hint={image.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
        
        {/* Specs */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="flex justify-start items-center gap-4 text-sm">
                <div className="flex items-center gap-1"><BedDouble size={16} /> <span>{property.bedrooms} Beds</span></div>
                <div className="flex items-center gap-1"><Bath size={16} /> <span>{property.bathrooms} Baths</span></div>
                <div className="flex items-center gap-1"><Square size={16} /> <span>{property.sqft.toLocaleString()} sqft</span></div>
            </div>
        </div>

        {/* Arrow Icon */}
        <div className="absolute top-4 right-4 text-white opacity-0 scale-80 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out">
            <ArrowUpRight size={24} />
        </div>

      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-headline font-bold">{property.title}</h3>
          <p className="text-sm text-muted-foreground">{property.location}</p>
        </div>
        <p className="text-xl font-headline font-bold">{formatPrice(property.price)}</p>
      </div>
    </Link>
  );
}
