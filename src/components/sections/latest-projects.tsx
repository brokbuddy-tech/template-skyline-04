
import { properties } from '@/lib/data';
import { AnimateOnScroll } from '../animate-on-scroll';
import { Button } from '../ui/button';
import Link from 'next/link';
import { OffPlanCard } from '../shared/off-plan-card';
import { ArrowRight } from 'lucide-react';

export function LatestProjects() {
  const offPlanProperties = properties.filter((p) => p.status === 'Off-plan');

  return (
    <section className="bg-background">
      <div className="container mx-auto">
        <AnimateOnScroll>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              Latest Launched Projects in Dubai
            </h2>
            <Button
              asChild
              variant="outline"
              className="hidden md:flex rounded-full bg-gray-100 hover:bg-gray-200 dark:text-black"
            >
              <Link href="/off-plan">
                VIEW ALL PROJECTS
                <span className="ml-2 bg-black text-white rounded-full p-1">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </Button>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <div className="relative">
            <div className="flex overflow-x-auto gap-8 pb-4 -mx-4 px-4 snap-x snap-mandatory">
              {offPlanProperties.map((property) => (
                <div key={property.id} className="snap-start">
                  <OffPlanCard property={property} />
                </div>
              ))}
            </div>
            <div className="md:hidden text-center mt-8">
                <Button asChild variant="secondary">
                    <Link href="/off-plan">VIEW ALL PROJECTS</Link>
                </Button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
