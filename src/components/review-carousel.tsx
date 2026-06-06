'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { ReviewCarouselItem } from '@/lib/reviews';
import { cn } from '@/lib/utils';

type ReviewCarouselVariant = 'light' | 'dark' | 'blue' | 'gold' | 'minimal';

type ReviewCarouselProps = {
  title: string;
  description?: string;
  items: ReviewCarouselItem[];
  variant?: ReviewCarouselVariant;
  className?: string;
};

const variantClasses: Record<ReviewCarouselVariant, {
  section: string;
  title: string;
  description: string;
  card: string;
  quote: string;
  author: string;
  meta: string;
  avatar: string;
  avatarText: string;
  button: string;
  starFilled: string;
  starEmpty: string;
}> = {
  light: {
    section: 'bg-muted text-foreground',
    title: 'text-primary',
    description: 'text-muted-foreground',
    card: 'border border-border bg-background shadow-sm',
    quote: 'text-foreground/80',
    author: 'text-foreground',
    meta: 'text-primary',
    avatar: 'bg-primary text-primary-foreground',
    avatarText: 'text-primary-foreground',
    button: 'border border-border bg-background text-foreground hover:border-primary hover:text-primary',
    starFilled: 'fill-primary text-primary',
    starEmpty: 'text-primary/25',
  },
  dark: {
    section: 'bg-black text-white',
    title: 'text-white',
    description: 'text-white/55',
    card: 'border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_rgba(0,0,0,0.28)]',
    quote: 'text-white/75',
    author: 'text-white',
    meta: 'text-white/45',
    avatar: 'bg-white/10 text-white ring-1 ring-white/10',
    avatarText: 'text-white',
    button: 'border border-white/10 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/10',
    starFilled: 'fill-[#D1A08B] text-[#D1A08B]',
    starEmpty: 'text-white/15',
  },
  blue: {
    section: 'bg-[#2348a0] text-white',
    title: 'text-white',
    description: 'text-white/80',
    card: 'border border-white/20 bg-white text-[#111827] shadow-[0_24px_70px_rgba(9,17,36,0.18)]',
    quote: 'text-[#111827]/75',
    author: 'text-[#111827]',
    meta: 'text-[#21479b]',
    avatar: 'bg-[#21479b] text-white',
    avatarText: 'text-white',
    button: 'border border-white/25 bg-white/10 text-white hover:bg-white hover:text-[#21479b]',
    starFilled: 'fill-[#48ddff] text-[#48ddff]',
    starEmpty: 'text-[#21479b]/20',
  },
  gold: {
    section: 'bg-black text-white',
    title: 'text-white',
    description: 'text-white/55',
    card: 'border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.3)]',
    quote: 'text-white/72',
    author: 'text-white',
    meta: 'text-[#D1A08B]',
    avatar: 'bg-[#D1A08B] text-black',
    avatarText: 'text-black',
    button: 'border border-[#D1A08B]/30 bg-transparent text-[#D1A08B] hover:bg-[#D1A08B] hover:text-black',
    starFilled: 'fill-[#D1A08B] text-[#D1A08B]',
    starEmpty: 'text-white/15',
  },
  minimal: {
    section: 'bg-white text-[#111111]',
    title: 'text-[#111111]',
    description: 'text-[#111111]/60',
    card: 'border border-gray-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]',
    quote: 'text-[#111111]/70',
    author: 'text-[#111111]',
    meta: 'text-primary',
    avatar: 'bg-primary text-white',
    avatarText: 'text-white',
    button: 'border border-gray-200 bg-white text-[#111111] hover:border-primary hover:text-primary',
    starFilled: 'fill-primary text-primary',
    starEmpty: 'text-gray-200',
  },
};

function getInitials(name: string) {
  return (
    name
      .split(/[\s&-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'AG'
  );
}

export function ReviewCarousel({
  title,
  description,
  items,
  variant = 'light',
  className,
}: ReviewCarouselProps) {
  const reviews = useMemo(
    () => items.filter((item) => item.quote.trim() && item.author.trim()),
    [items],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const styles = variantClasses[variant];

  if (!reviews.length) return null;

  const active = reviews[activeIndex % reviews.length];
  const canMove = reviews.length > 1;
  const avatar = active.image?.trim();

  const move = (direction: 'previous' | 'next') => {
    if (!canMove) return;
    setActiveIndex((current) => {
      if (direction === 'previous') return (current - 1 + reviews.length) % reviews.length;
      return (current + 1) % reviews.length;
    });
  };

  return (
    <section className={cn('py-16 md:py-24', styles.section, className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className={cn('text-3xl font-bold tracking-tight md:text-5xl', styles.title)}>
            {title}
          </h2>
          {description ? (
            <p className={cn('mx-auto mt-4 max-w-2xl text-base leading-7 md:text-lg', styles.description)}>
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => move('previous')}
            disabled={!canMove}
            aria-label="Show previous testimonial"
            className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-35', styles.button)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <article
            className={cn('min-h-[360px] w-full max-w-4xl px-6 py-10 text-center sm:px-10 md:px-16', styles.card)}
            aria-live="polite"
          >
            <div className={cn('mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-xl font-bold', styles.avatar)}>
              {avatar ? (
                <img src={avatar} alt={active.author} className="h-full w-full object-cover" />
              ) : (
                <span className={styles.avatarText}>{getInitials(active.author)}</span>
              )}
            </div>

            <div className="mt-6 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`${active.id}-star-${index}`}
                  className={cn('h-5 w-5', index < active.rating ? styles.starFilled : styles.starEmpty)}
                />
              ))}
            </div>

            <p className={cn('mx-auto mt-7 max-w-3xl text-lg italic leading-8 md:text-2xl md:leading-10', styles.quote)}>
              "{active.quote}"
            </p>

            <div className="mt-8">
              <p className={cn('text-base font-bold md:text-lg', styles.author)}>{active.author}</p>
              <p className={cn('mt-2 text-sm font-semibold', styles.meta)}>
                {active.badgeLabel || active.location || 'Client testimonial'}
              </p>
            </div>
          </article>

          <button
            type="button"
            onClick={() => move('next')}
            disabled={!canMove}
            aria-label="Show next testimonial"
            className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-35', styles.button)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
