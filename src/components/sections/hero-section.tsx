'use client';

import { AnimateOnScroll } from '../animate-on-scroll';

const AnimatedLine = ({
  text,
  delay,
}: {
  text: string;
  delay: number;
}) => (
  <div className="overflow-hidden">
    <div
      className="animate-line-reveal"
      style={{ animationDelay: `${delay}ms` }}
    >
      {text}
    </div>
  </div>
);

export function HeroSection() {
  const headline = 'Luxury Real Estate';

  return (
    <section className="relative flex h-screen min-h-[700px] w-full items-center justify-center bg-background text-center">
      <div className="max-w-4xl">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-headline font-normal leading-none tracking-tighter">
          <AnimatedLine text="Luxury" delay={200} />
          <AnimatedLine text="Real Estate" delay={400} />
        </h1>
      </div>
    </section>
  );
}
