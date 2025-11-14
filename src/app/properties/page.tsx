import { AdvancedSearchModal } from "@/components/shared/advanced-search-modal";
import { PropertyCard } from "@/components/shared/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { properties } from "@/lib/data";

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
          <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
            <Input placeholder="Location (e.g., 'Malibu, California')" className="bg-background"/>
            <Select>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
            <AdvancedSearchModal />
            <Button size="default" className="w-full md:w-auto">Search</Button>
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
