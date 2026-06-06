'use client';

import { ReviewCarousel } from '@/components/review-carousel';
import { normalizePublicTestimonials } from '@/lib/reviews';
import type { Testimonial } from '@/lib/types';

type PublicTestimonial = Testimonial & {
  clientName?: string;
  name?: string;
  message?: string;
  imageUrl?: string | null;
  badgeLabel?: string | null;
};

export function TestimonialsSection({ testimonials = [] }: { testimonials?: PublicTestimonial[] }) {
  return (
    <ReviewCarousel
      title="What Our Clients Say"
      items={normalizePublicTestimonials(testimonials)}
      variant="blue"
    />
  );
}
