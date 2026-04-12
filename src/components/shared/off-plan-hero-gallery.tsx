'use client';

import { Camera, MapPin, Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Property } from '@/lib/types';
import { ProgressiveImage } from './progressive-image';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog';

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
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // ALL images (not just 4)
  const allImages =
    property.media?.length
      ? property.media
      : property.images || [];

  const [visitedIndices, setVisitedIndices] = useState<Set<number>>(new Set([0]));
  useEffect(() => {
    setVisitedIndices(prev => new Set(prev).add(activeIndex));
  }, [activeIndex]);


  return (
    <div className="w-full container mx-auto px-4 sm:px-8 py-6">
      {/* Desktop Bento Grid */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-[500px]">
        {/* Main Image */}
        <div className="col-span-2 row-span-2 rounded-l-2xl overflow-hidden relative cursor-pointer group">
          {mainImage && (
            <div
              onClick={() => {
                setActiveIndex(0);
                setIsOpen(true);
              }}
              className="w-full h-full"
            >
              <ProgressiveImage
                source={mainImage}
                alt={property.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                imageClassName="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
            {galleryBadge}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
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
            <div
              onClick={() => {
                setActiveIndex(1);
                setIsOpen(true);
              }}
              className="w-full h-full"
            >

              <ProgressiveImage
                source={lifestyleImage}
                alt={`${property.title} view 2`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                imageClassName="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
        </div>

        {/* Amenity Image */}
        <div className="col-span-1 row-span-1 overflow-hidden relative cursor-pointer group">
          {amenityImage && (
            <div
              onClick={() => {
                setActiveIndex(2);
                setIsOpen(true);
              }}
              className="w-full h-full"
            >

              <ProgressiveImage
                source={amenityImage}
                alt={`${property.title} view 3`}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                imageClassName="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
        </div>

        {/* View All Trigger */}
        <div className="col-span-1 row-span-1 rounded-br-2xl overflow-hidden relative cursor-pointer group">
          {bedroomImage && (
            <div
              onClick={() => {
                setActiveIndex(3);
                setIsOpen(true);
              }}
              className="w-full h-full"
            >

              <ProgressiveImage
                source={bedroomImage}
                alt={`${property.title} view 4`}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                imageClassName="object-cover transition-transform group-hover:scale-105"
              />
            </div>
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/95 z-[9999]" />
          <DialogContent className="fixed inset-0 z-[10000] flex flex-col items-center justify-center w-screen h-screen max-w-none m-0 p-0 border-none bg-transparent shadow-none !translate-x-0 !translate-y-0 !top-0 !left-0 [&>button:last-child]:hidden">

            {/* Custom Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 left-6 text-white bg-black/50 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/70 transition-colors z-[101]"
            >
              <ChevronLeft size={20} /> Back to gallery
            </button>

            {/* Image Slider Area */}
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-16">
              <div className="relative w-full h-full">
                {allImages.map((image, i) => {
                  const isVisited = visitedIndices.has(i) || i === activeIndex;
                  const isActive = i === activeIndex;

                  if (!isVisited) return null;

                  return (
                    <div 
                      key={i}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                    >
                      <ProgressiveImage
                        source={image}
                        fill
                        sizes="100vw"
                        className="bg-transparent"
                        imageClassName="object-contain w-full h-full"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Prev */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-colors backdrop-blur-sm z-[101]"
              >
                <ChevronLeft size={32} />
              </button>

              {/* Next */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev + 1) % allImages.length);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-colors backdrop-blur-sm z-[101]"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Counter */}
            <div className="absolute bottom-6 right-6 text-white bg-black/50 px-4 py-2 rounded-lg backdrop-blur-md text-sm font-medium z-[101]">
              {activeIndex + 1} / {allImages.length}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
