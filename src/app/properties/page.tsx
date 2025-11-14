'use client';

import { AdvancedSearchModal } from "@/components/shared/advanced-search-modal";
import { PropertyCard } from "@/components/shared/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { properties } from "@/lib/data";
import { SlidersHorizontal, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function PropertiesPage() {
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSearchVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (searchRef.current) {
      observer.observe(searchRef.current);
    }

    return () => {
      if (searchRef.current) {
        observer.unobserve(searchRef.current);
      }
    };
  }, []);

  return (
    <>
      <section className="pt-24 pb-16 bg-background">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-headline font-medium">Our Properties</h1>
        </div>
      </section>

      <section ref={searchRef} className="py-8 sticky top-20 z-30 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <Dialog>
            <div className="flex flex-col md:flex-row gap-0 p-2 border border-primary rounded-lg bg-background">
              <Input 
                placeholder="Search by Location..." 
                className="bg-transparent border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="w-px bg-border h-auto" />
              <Select>
                <SelectTrigger className="bg-transparent border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 [&>svg]:hidden w-48 text-muted-foreground">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
              <div className="w-px bg-border h-auto" />
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full md:w-auto rounded-none hover:bg-accent hover:text-accent-foreground border-y border-transparent hover:border-y-input">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Advanced
                </Button>
              </DialogTrigger>
              <Button size="default" className="w-full md:w-auto rounded-l-none">Search</Button>
            </div>
            <AdvancedSearchModal />
          </Dialog>
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

      {/* Sticky Search Icon */}
      <Dialog>
        <DialogTrigger asChild>
            <Button 
              className={cn(
                "fixed bottom-24 right-5 z-40 h-16 w-16 rounded-full bg-accent text-accent-foreground shadow-lg transition-all duration-300 ease-in-out",
                isSearchVisible ? "opacity-0 scale-80" : "opacity-100 scale-100"
              )}
              aria-label="Open advanced search"
            >
              <Search className="h-6 w-6" />
            </Button>
        </DialogTrigger>
        <AdvancedSearchModal />
      </Dialog>
    </>
  );
}