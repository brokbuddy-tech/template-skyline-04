'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
          className="absolute inset-0 z-10 flex flex-col md:grid md:grid-cols-12 items-center gap-8 px-8 container mx-auto text-white"
          style={{ opacity: Math.max(0, opacity) }}
        >
          {/* Main Column - Center on mobile */}
          <div className="md:col-span-8 flex justify-center items-center text-center order-1 md:order-2 mt-24 md:mt-0">
             <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center">
               Transforming Spaces, <br /> Realizing <span className="text-accent">Dreams.</span>
             </h1>
          </div>
          
          {/* Left Column */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start gap-4 order-2 md:order-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < 5 ? 'text-accent fill-accent' : 'text-accent'
                  )}
                />
              ))}
            </div>
            <p className="text-sm font-medium">12K Rating (4.9 average)</p>
            <div className="flex -space-x-2">
              {avatarImages.map((avatar, i) => (
                avatar && (
                  <Image
                    key={avatar.id}
                    src={avatar.imageUrl}
                    alt={avatar.description}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border-2 border-background"
                    data-ai-hint={avatar.imageHint}
                  />
                )
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
                <span className="text-lg font-bold">+</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 flex flex-col items-center md:items-end text-center md:text-right gap-4 order-3 md:order-3">
            <p className="text-base">
              Turning your vision into reality, we specialize in creating exceptional living spaces.
            </p>
            <Button size="lg" asChild>
              <Link href="/properties">
                Explore Properties
                <span className="rotate-[-45deg] group-hover:rotate-0 transition-transform duration-300">↗</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
