'use client';

import { useState } from 'react';
import { PropertyCard } from "@/components/shared/property-card";
import { properties } from "@/lib/data";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AdvancedSearchModal } from '@/components/shared/advanced-search-modal';
import { SlidersHorizontal } from 'lucide-react';
import { StickySearch } from '@/components/shared/sticky-search';

export default function PropertiesPage() {

  return (
    <>
      <section className="pt-24 pb-16 bg-background">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-headline font-medium">Our Properties</h1>
        </div>
      </section>

      <section className="py-8 sticky top-20 z-30 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center p-4 rounded-lg border bg-background shadow-sm">
            <Input placeholder="Search by Location..." className="border-primary focus-visible:ring-primary" />
            <Select>
                <SelectTrigger className="w-full md:w-[180px] border-primary focus:ring-primary">
                    <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                </SelectContent>
            </Select>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        <SlidersHorizontal className="mr-2 h-4 w-4" /> Advanced
                    </Button>
                </DialogTrigger>
                <AdvancedSearchModal />
            </Dialog>
            <Button className="w-full md:w-auto bg-primary text-primary-foreground">Search</Button>
          </div>
        </div>
      </section>
      
      <StickySearch />

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