
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeroSearch } from './hero-search';
import { cn } from '@/lib/utils';

const slideImages = [
  PlaceHolderImages.find((img) => img.id === 'hero-main'),
  PlaceHolderImages.find((img) => img.id === 'cta-background'),
  PlaceHolderImages.find((img) => img.id === 'about-hero'),
].filter(Boolean) as (typeof PlaceHolderImages)[0][];


export function HeroSection({ categories = [] }: { categories?: string[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
        {slideImages.map((image, index) => (
            <div
                key={image.id}
                className={cn(
                    "absolute inset-0 h-full w-full transition-opacity duration-1000",
                    index === currentSlide ? "opacity-100 z-10" : "opacity-0"
                )}
            >
                <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-[3000ms] ease-linear",
                        index === currentSlide ? "scale-100" : "scale-110"
                    )}
                    priority={index === 0}
                    data-ai-hint={image.imageHint}
                />
            </div>
        ))}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div
          className="absolute inset-0 z-20 flex flex-col justify-center items-center gap-8 px-4 container mx-auto text-white"
        >
          <div className='text-center'>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white text-center text-balance">
              Transforming Spaces, <br /> Realizing <span className="text-[#ff3223]">Dreams.</span>
            </h1>
          </div>
          <HeroSearch categories={categories} />
        </div>
    </div>
  );
}
