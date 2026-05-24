
'use client';

import Image from 'next/image';
import { AnimateOnScroll } from '../animate-on-scroll';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import type { Testimonial } from '@/lib/types';
import { resolveImage } from '@/lib/property-media';

type PublicTestimonial = Testimonial & {
    clientName?: string;
    name?: string;
    message?: string;
    imageUrl?: string | null;
    badgeLabel?: string | null;
};

function normalizeTestimonial(testimonial: PublicTestimonial): Testimonial & { badgeLabel?: string | null } | null {
    const quote = testimonial.message?.trim() || testimonial.quote?.trim();
    const author = testimonial.clientName?.trim() || testimonial.author?.trim() || testimonial.name?.trim();

    if (!quote || !author) return null;

    return {
        id: testimonial.id,
        quote,
        author,
        location: testimonial.location,
        image: testimonial.imageUrl || testimonial.image || null,
        rating: typeof testimonial.rating === 'number' ? testimonial.rating : 5,
        badgeLabel: testimonial.badgeLabel,
    };
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial & { badgeLabel?: string | null } }) => {
    const image = resolveImage(testimonial.image || null, 'testimonial-1');

    return (
        <Card className="w-full max-w-sm flex-shrink-0 bg-gray-50 dark:bg-muted/50 border-gray-200/80 dark:border-border/50">
            <CardContent className="p-6">
                <p className="text-foreground font-body mb-6 text-base">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                    {image && (
                        <Image
                            src={image.src}
                            alt={testimonial.author}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                            data-ai-hint={image.hint}
                            unoptimized={image.unoptimized}
                        />
                    )}
                    <div>
                        <p className="font-bold font-body text-foreground">{testimonial.author}</p>
                        {testimonial.badgeLabel ? (
                            <p className="text-xs text-muted-foreground">{testimonial.badgeLabel}</p>
                        ) : null}
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


export function TestimonialsSection({ testimonials = [] }: { testimonials?: PublicTestimonial[] }) {
    const data = testimonials.map(normalizeTestimonial).filter((item): item is Testimonial & { badgeLabel?: string | null } => Boolean(item));
    if (!data.length) return null;

    const duplicatedTestimonials = [...data, ...data];

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
