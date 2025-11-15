'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { testimonials } from '@/lib/data';
import { AnimateOnScroll } from '../animate-on-scroll';

export function TestimonialsSection() {
  return (
    <section className="bg-background">
      <div className="container mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-medium">From Our Clients</h2>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => {
                const image = PlaceHolderImages.find(
                  (img) => img.id === testimonial.image
                );
                return (
                  <CarouselItem key={index}>
                    <div className="text-center max-w-4xl mx-auto">
                      <p className="text-3xl md:text-4xl font-headline leading-tight font-medium mb-8 text-balance">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <div className="flex flex-col items-center">
                         {image && (
                           <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                             <Image
                              src={image.imageUrl}
                              alt={testimonial.author}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              data-ai-hint={image.imageHint}
                            />
                           </div>
                         )}
                        <p className="font-semibold text-lg">{testimonial.author}</p>
                        <p className="text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 transform text-primary bg-transparent border-none hover:bg-accent h-12 w-12" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 transform text-primary bg-transparent border-none hover:bg-accent h-12 w-12" />
            </div>
          </Carousel>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
