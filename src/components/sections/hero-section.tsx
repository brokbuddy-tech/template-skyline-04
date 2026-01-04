'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeroSearch } from './hero-search';

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-main');

  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0 h-full w-full">
        {heroImage && (
          <>
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </>
        )}

        <div
          className="absolute inset-0 z-20 flex flex-col justify-center items-center gap-8 px-4 container mx-auto text-white"
        >
          <div className='text-center'>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center">
              Transforming Spaces, <br /> Realizing <span className="text-accent">Dreams.</span>
            </h1>
          </div>
          <HeroSearch />
        </div>
      </div>
    </div>
  );
}
