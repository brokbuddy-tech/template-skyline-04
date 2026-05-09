import { PropertyCard } from "../shared/property-card";
import { Button } from "../ui/button";
import Link from "next/link";
import { AnimateOnScroll } from "../animate-on-scroll";
import type { Property } from "@/lib/types";
import { prefixAgencyPath } from "@/lib/agency-routing";

export function FeaturedProperties({
  properties,
  agencySlug,
}: {
  properties: Property[];
  agencySlug?: string | null;
}) {
  const featuredProperties = properties.slice(0, 3);

  return (
    <section className="bg-background">
      <div className="container mx-auto">
        <AnimateOnScroll className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-medium text-balance">
            Find your home with <span className="text-primary">unique preferences</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
            Explore a curated selection of homes designed to match your unique preferences, making it effortless to find the ideal property that perfectly fits your lifestyle and needs.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {featuredProperties.map((property, index) => (
            <AnimateOnScroll key={property.id} delay={index * 150}>
              <PropertyCard property={property} />
            </AnimateOnScroll>
          ))}
        </div>
        <AnimateOnScroll className="text-center mt-16">
            <Button asChild size="lg">
                <Link href={prefixAgencyPath('/properties', agencySlug)}>View All Properties</Link>
            </Button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
