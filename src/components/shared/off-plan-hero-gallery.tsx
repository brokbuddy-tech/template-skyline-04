
'use client';

import { Camera, MapPin, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Property } from '@/lib/types';
import { ProgressiveImage } from './progressive-image';

interface OffPlanHeroGalleryProps {
  property: Property;
  badgeText?: string;
  mapHref?: string;
}

export function OffPlanHeroGallery({
  property,
  badgeText,
  mapHref = '#property-location',
}: OffPlanHeroGalleryProps) {
  const images = [
    property.media?.[0] || property.images?.[0] || 'prop-1-1',
    property.media?.[1] || property.images?.[1] || 'prop-1-2',
    property.media?.[2] || property.images?.[2] || 'prop-1-3',
    property.media?.[3] || property.images?.[3] || 'prop-4-1',
  ];
  
  const [mainImage, lifestyleImage, amenityImage, bedroomImage] = images;
  const galleryBadge = badgeText || (property.status === 'Off-plan' ? 'Artist Impression' : 'Property Gallery');
  const extraPhotoCount = Math.max((property.images?.length || 0) - 4, 0);
  const photoCountLabel = extraPhotoCount > 0 ? `+ ${extraPhotoCount} Photos` : 'View Gallery';

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Desktop Bento Grid */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-[500px]">
        {/* Main Image */}
        <div className="col-span-2 row-span-2 rounded-l-2xl overflow-hidden relative cursor-pointer group">
          {mainImage && (
            <>
              <ProgressiveImage
                source={mainImage}
                alt={property.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                imageClassName="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </>
          )}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
            {galleryBadge}
          </div>
          <div className="absolute bottom-4 right-4 flex gap-3">
            <Button variant="outline-light" className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-foreground dark:text-black">
              <Camera size={16} /> <span className="ml-2">Virtual Tour</span>
            </Button>
            <Button variant="outline-light" className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-foreground dark:text-black">
              <Play size={16} /> <span className="ml-2">Watch Video</span>
            </Button>
            <Button
              asChild
              variant="outline-light"
              className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-foreground dark:text-black"
            >
              <a href={mapHref}>
                <MapPin size={16} /> <span className="ml-2">Show on Map</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Lifestyle Image */}
        <div className="col-span-2 row-span-1 rounded-tr-2xl overflow-hidden relative cursor-pointer group">
          {lifestyleImage && (
            <ProgressiveImage
              source={lifestyleImage}
              alt={`${property.title} view 2`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              imageClassName="object-cover transition-transform group-hover:scale-105"
            />
          )}
        </div>
        
        {/* Amenity Image */}
        <div className="col-span-1 row-span-1 overflow-hidden relative cursor-pointer group">
          {amenityImage && (
            <ProgressiveImage
              source={amenityImage}
              alt={`${property.title} view 3`}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              imageClassName="object-cover transition-transform group-hover:scale-105"
            />
          )}
        </div>
        
        {/* View All Trigger */}
        <div className="col-span-1 row-span-1 rounded-br-2xl overflow-hidden relative cursor-pointer group">
          {bedroomImage && (
            <ProgressiveImage
              source={bedroomImage}
              alt={`${property.title} view 4`}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              imageClassName="object-cover transition-transform group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-black/60 hover:bg-black/70 transition-colors flex items-center justify-center">
            <p className="text-white font-bold text-lg">{photoCountLabel}</p>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden flex h-[300px] overflow-x-auto snap-x gap-2">
        {images.map((image, index) => image && (
          <div key={index} className="w-[90vw] h-full flex-shrink-0 rounded-xl overflow-hidden relative snap-center">
            <ProgressiveImage
              source={image}
              alt={`${property.title} image ${index + 1}`}
              fill
              sizes="90vw"
              imageClassName="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
