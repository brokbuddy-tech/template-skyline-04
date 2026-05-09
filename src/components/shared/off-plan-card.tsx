
'use client';

import type { Property } from '@/lib/types';
import Link from 'next/link';
import { MapPin, Building2, Clock } from 'lucide-react';
import { EmaarLogo, NakheelLogo } from './developer-logos';
import { Separator } from '../ui/separator';
import { ProgressiveImage } from './progressive-image';
import { prefixAgencyPath, resolveAgencySlugFromPathname } from '@/lib/agency-routing';
import { usePathname } from 'next/navigation';

const developerLogos = {
    'Emaar': EmaarLogo,
    'Nakheel': NakheelLogo,
}

export function OffPlanCard({ property }: { property: Property }) {
  const image = property.media?.[0] || property.images[0];
  const DevLogo = property.developerLogo ? developerLogos[property.developerLogo as keyof typeof developerLogos] : null;
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);

  return (
    <div className="w-[320px] md:w-[380px] bg-white dark:bg-black rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 flex-shrink-0 group">
      <Link href={prefixAgencyPath(`/properties/${property.id}`, agencySlug)} className="block">
        <div className="relative h-[250px]">
          {image && (
            <ProgressiveImage
              source={image}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, 380px"
              imageClassName="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {/* Red Ribbon */}
          <div className="absolute top-0 left-0 w-10 h-10">
            <div className="absolute transform -rotate-45 bg-red-600 text-center text-white font-semibold py-1 left-[-34px] top-[16px] w-[120px] shadow-lg border-b-2 border-red-800">
                New
            </div>
          </div>
          {property.tag && (
             <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {property.tag}
             </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{property.title}</h3>
          <div className="mt-2 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <p className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{property.location}</span>
            </p>
            {DevLogo && (
                <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <DevLogo className="w-16 h-auto text-gray-500 dark:text-gray-400" />
                </div>
            )}
            {!DevLogo && property.developerName && (
                <p className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span>{property.developerName}</span>
                </p>
            )}
          </div>
          <Separator className="my-3" />
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={16} />
            <span>{property.handoverDate ? `Handover ${property.handoverDate}` : 'Launch details available'}</span>
          </div>
        </div>
        <div className="bg-black text-white p-3 text-center font-bold">
          from AED {property.price.toLocaleString()}
        </div>
      </Link>
    </div>
  );
}
