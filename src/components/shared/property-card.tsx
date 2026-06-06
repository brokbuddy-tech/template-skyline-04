
'use client';

import Link from 'next/link';
import { useContext } from 'react';
import type { Property } from '@/lib/types';
import { ArrowUpRight, BedDouble, Bath, Square, Star } from 'lucide-react';
import { CurrencyContext } from '@/context/currency-context';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { ProgressiveImage } from './progressive-image';
import { prefixAgencyPath, resolveAgencySlugFromPathname } from '@/lib/agency-routing';
import { usePathname } from 'next/navigation';
import { AmenityIcon } from '@/components/amenity-icon';


interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const image = property.media?.[0] || property.images[0];
  const { formatPrice } = useContext(CurrencyContext);
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);

  const isForSale = property.transactionType === 'Sale';
  const isOffPlan = property.status === 'Off-plan';

  return (
    <div className="group" data-hoverable="true">
      <Link href={prefixAgencyPath(`/properties/${property.id}`, agencySlug)} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted/20">
          {image && (
            <ProgressiveImage
              source={image}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {isOffPlan && property.handoverDate ? (
            <div className="absolute top-4 left-4 z-10 rounded-md bg-black/30 backdrop-blur-md px-3 py-1 text-white text-xs font-medium border border-white/20">
              Handover {property.handoverDate}
            </div>
          ) : (
            <div
              className={cn(
                'absolute top-4 left-4 z-10 rounded-[4px] px-3 py-1 text-white text-[10px] font-bold uppercase tracking-wider',
                isForSale ? 'bg-rose-600' : 'bg-emerald-500'
              )}
            >
              {isForSale ? 'For Sale' : 'For Rent'}
            </div>
          )}


          {(property.featured || property.recentlyListed) && (
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
              {property.featured && (
                <Badge className="bg-accent text-accent-foreground rounded-full flex items-center gap-1 border-none">
                    <Star className="w-3 h-3" />
                    <span>Featured</span>
                </Badge>
              )}
              {property.recentlyListed && (
                <Badge className="bg-black/70 text-white rounded-full border border-white/15 backdrop-blur-sm">
                  Recently Listed
                </Badge>
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
          
          {/* Arrow Icon for mobile */}
          <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 scale-80 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out">
              <ArrowUpRight size={48} />
          </div>

          {/* Amenities for desktop hover */}
          <div className="hidden md:flex absolute inset-0 p-6 flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
            <h4 className="text-lg font-bold mb-2">Key Features</h4>
            <ul className="space-y-1 text-sm">
                {property.amenities.slice(0, 3).map(amenity => (
                    <li key={amenity} className="flex items-center gap-2">
                        <AmenityIcon name={amenity} className="h-4 w-4 brightness-0 invert" />
                        <span>{amenity}</span>
                    </li>
                ))}
            </ul>
            <div className="absolute top-4 right-4">
              <ArrowUpRight size={24} />
            </div>
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
