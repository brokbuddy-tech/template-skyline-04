
'use client';

import Image from 'next/image';
import { useState, useContext } from 'react';
import Link from 'next/link';
import {
  Bed,
  Bath,
  Maximize,
  Camera,
  Heart,
  MapPin,
  Phone,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';
import { CurrencyContext } from '@/context/currency-context';
import { EmaarLogo, NakheelLogo } from './developer-logos';

const developerLogos: { [key: string]: React.FC<any> } = {
  Emaar: EmaarLogo,
  Nakheel: NakheelLogo,
};

export function OffPlanPropertyCard({ property }: { property: Property }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const image = PlaceHolderImages.find((img) => img.id === property.images[0]);
  const DeveloperLogo = property.developerLogo ? developerLogos[property.developerLogo] : null;
  const { formatPrice } = useContext(CurrencyContext);


  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <Link href={`/properties/${property.id}`} className="block">
        {/* Image Section */}
        <div className="relative h-[280px] w-full overflow-hidden">
          {image ? (
              <Image
                  src={image.imageUrl}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
          ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  {DeveloperLogo && <DeveloperLogo className="w-24 h-auto text-gray-500" />}
              </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">
            <Camera size={14} />
            <span>{property.photoCount}</span>
          </div>

          {property.tag && (
              <div className="absolute top-4 right-4 bg-white text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
                  {property.tag}
              </div>
          )}
          
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFavorited(!isFavorited); }}
            className="absolute top-12 right-4 bg-white/90 p-2 rounded-full text-gray-700 hover:text-red-500 transition-colors z-10"
          >
            <Heart size={18} className={cn(isFavorited ? 'text-red-500 fill-current' : 'text-gray-600')} />
          </button>

          <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full text-gray-700 shadow-md">
              <MapPin size={18} />
          </button>
        </div>

        {/* Details Section */}
        <div className="p-6">
          <p className="text-[#1E3A8A] dark:text-blue-400 text-2xl font-bold mb-1">
            {formatPrice(property.price)}
          </p>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate h-7">
            {property.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-3">
            <div className="flex items-center gap-1.5">
              <Bed size={16} />
              <span>{property.bedrooms} Bed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath size={16} />
              <span>{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize size={16} />
              <span>{property.sqft.toLocaleString()} sq-ft</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-3">
              <MapPin size={16} />
              <span>{property.location}</span>
          </div>
        </div>
      </Link>
      
      {/* Footer Actions */}
      <div className="px-6 pb-6">
        <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between gap-2">
            <Button variant="outline" className="w-full rounded-full border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400">
                <Phone size={16} className="mr-2"/> Call Us
            </Button>
            <Button variant="outline" className="w-full rounded-full border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/50 hover:text-green-600 dark:hover:text-green-400">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2"><path d="M16.6 14c-.2-.2-.5-.3-.7-.3c-.3 0-.5.1-.7.3l-1.5 1.5c-1.1-1-2.2-2.1-3.2-3.2l1.5-1.5c.4-.4.4-1 0-1.4l-4-4c-.4-.4-1-.4-1.4 0l-1.5 1.5c-.2.2-.3.4-.3.7s.1.5.3.7c.8.8 1.8 1.8 2.8 2.8c1.3 1.3 2.6 2.5 4 3.5c.2.1.4.2.6.2s.4-.1.6-.2l1.5-1.5c.4-.4.4-1 0-1.4l-2.4-2.4zm5.4-8.8c-.4-.4-1-.4-1.4 0L19 6.8c-.4.4-.4 1 0 1.4c.8.8 1.4 1.8 1.8 2.8c.4.4 1 .4 1.4 0l1.8-1.8c.4-.4.4-1 0-1.4zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8s8 3.6 8 8s-3.6 8-8 8z" /></svg>
                Whatsapp
            </Button>
             <Button variant="outline" size="icon" className="rounded-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0">
                <Share2 size={16}/>
            </Button>
        </div>
      </div>
    </div>
  );
}
