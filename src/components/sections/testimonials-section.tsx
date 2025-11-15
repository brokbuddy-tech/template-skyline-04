
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { testimonials } from '@/lib/data';
import { AnimateOnScroll } from '../animate-on-scroll';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';

const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => {
    const image = PlaceHolderImages.find(img => img.id === testimonial.image);

    return (
        <Card className="w-full max-w-sm flex-shrink-0 bg-gray-50 dark:bg-muted/50 border-gray-200/80 dark:border-border/50">
            <CardContent className="p-6">
                <p className="text-foreground font-body mb-6 text-base">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                    {image && (
                        <Image
                            src={image.imageUrl}
                            alt={testimonial.author}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                            data-ai-hint={image.imageHint}
                        />
                    )}
                    <div>
                        <p className="font-bold font-body text-foreground">{testimonial.author}</p>
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        'w-4 h-4',
                                        i < testimonial.rating ? 'text-accent fill-accent' : 'text-gray-300'
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


export function TestimonialsSection() {
    const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="bg-background">
      <div className="container mx-auto text-center mb-16">
        <AnimateOnScroll>
            <h2 className="text-5xl md:text-6xl font-headline font-bold">From Our Clients</h2>
        </AnimateOnScroll>
      </div>
      <div className="w-full overflow-hidden group" style={{ maskImage: 'linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)' }}>
          <div className="flex gap-8 group-hover:[animation-play-state:paused] animate-infinite-scroll">
              {duplicatedTestimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} testimonial={testimonial} />
              ))}
          </div>
      </div>
    </section>
  );
}
