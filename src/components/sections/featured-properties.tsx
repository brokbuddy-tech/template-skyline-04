import { properties } from "@/lib/data";
import { PropertyCard } from "../shared/property-card";
import { Button } from "../ui/button";
import Link from "next/link";

export function FeaturedProperties() {
  const featuredProperties = properties.slice(0, 3);

  return (
    <section className="bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-medium">Featured Properties</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className="text-center mt-16">
            <Button asChild size="lg">
                <Link href="/properties">View All Properties</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
