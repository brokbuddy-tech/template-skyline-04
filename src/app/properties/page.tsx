import { AdvancedSearchModal } from "@/components/shared/advanced-search-modal";
import { PropertyCard } from "@/components/shared/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { properties } from "@/lib/data";
import { SlidersHorizontal } from "lucide-react";

export default function PropertiesPage() {
  return (
    <>
      <section className="pt-24 pb-16 bg-background">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-headline font-medium">Our Properties</h1>
        </div>
      </section>

      <section className="py-8 sticky top-20 z-30 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-0 p-2 border rounded-lg">
            <Input 
              placeholder="Search by Location..." 
              className="bg-transparent border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="w-px bg-border h-auto" />
            <Select>
              <SelectTrigger className="bg-transparent border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 [&>svg]:hidden w-48">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-px bg-border h-auto" />
            <AdvancedSearchModal />
            <Button size="default" className="w-full md:w-auto rounded-l-none">Search</Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
