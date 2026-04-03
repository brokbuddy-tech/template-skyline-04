import Link from 'next/link';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CountUp } from '../shared/count-up';
import { AnimateOnScroll } from '../animate-on-scroll';
import type { SiteStats } from '@/lib/types';

export function StatsSection({ stats }: { stats?: SiteStats }) {
  const cards = [
    { value: stats?.totalListings ?? 0, suffix: '+', label: 'Modern Properties' },
    { value: 98, suffix: '%', label: 'Client Satisfaction' },
    { value: 12, suffix: '+', label: 'Years of Experience' },
    { value: 5, suffix: '+', label: 'Awards & Recognition' },
  ];

  return (
    <section className="bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <AnimateOnScroll>
              <h2 className="text-4xl md:text-5xl font-headline font-medium mb-6 text-balance">
                Building dreams into stunning <span className="text-accent">real estate</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 text-balance">
                We take pride in our track record of success and the relationships we've built. Our numbers speak for themselves, showcasing our commitment to excellence in every project we undertake.
              </p>
              <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Link href="/about">
                  More About Us
                  <span className="group-hover:translate-x-1 transition-transform duration-300">↗</span>
                </Link>
              </Button>
            </AnimateOnScroll>
          </div>
          <div className="lg:col-span-3">
            <AnimateOnScroll delay={200}>
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                {cards.map((stat, index) => (
                  <Card key={index} className="bg-accent/10 dark:bg-transparent p-4 md:p-8 rounded-lg text-center">
                    <h3 className="text-4xl sm:text-5xl md:text-7xl font-bold font-headline text-accent">
                      <CountUp end={stat.value} duration={2} />
                      {stat.suffix}
                    </h3>
                    <p className="text-accent mt-2 text-sm sm:text-base">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}


