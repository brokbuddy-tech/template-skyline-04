'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { HeroSearch } from './hero-search';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-main');
  const avatarImages = [
    PlaceHolderImages.find((img) => img.id === 'testimonial-1'),
    PlaceHolderImages.find((img) => img.id === 'testimonial-2'),
    PlaceHolderImages.find((img) => img.id === 'avatar-3'),
  ].filter(Boolean);

  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      const heroHeight = hero.offsetHeight;
      const start = rect.top + window.scrollY;
      const end = start + heroHeight;

      if (window.scrollY >= start && window.scrollY <= end) {
        const progress = (window.scrollY - start) / (heroHeight * 0.75);
        setScrollProgress(Math.min(progress, 1));
      } else if (window.scrollY < start) {
        setScrollProgress(0);
      } else {
        setScrollProgress(1);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scale = 1 + scrollProgress * 1; 
  const opacity = 1 - scrollProgress * 2.5;

  return (
    <div ref={heroRef} className="relative h-[150vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {heroImage && (
          <div
            ref={imageRef}
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{ transform: `scale(${scale})` }}
          >
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        )}

        <div
          ref={contentRef}
          className="absolute inset-0 z-20 flex flex-col justify-center items-center gap-8 px-4 container mx-auto text-white"
          style={{ opacity: Math.max(0, opacity) }}
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
