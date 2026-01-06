
'use client';

import { useState, useEffect, useContext } from 'react';
import { properties } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { BedDouble, Bath, Square, MapPin, Building, LandPlot, HandHelping, Banknote, ShieldCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MortgageCalculator } from "@/components/shared/mortgage-calculator";
import { PropertyCard } from "@/components/shared/property-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { CurrencyContext } from '@/context/currency-context';
import { amenityIcons } from '@/lib/amenity-icons';
import { ReadMore } from '@/components/shared/read-more';
import { AgentSidebar } from '@/components/shared/agent-sidebar';
import { LocationMap } from '@/components/shared/location-map';
import { OffPlanPropertyPage } from '@/components/shared/off-plan-property-page';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { UpfrontCostModal } from '@/components/shared/upfront-cost-modal';
import { Card } from '@/components/ui/card';

const propertyTypeIcons: { [key: string]: React.ElementType } = {
  'House': Building,
  'Apartment': Building,
  'Penthouse': Building,
  'Land': LandPlot,
  'Default': Building
};

export default function PropertyDetailPage() {
  const params = useParams();
  const property = properties.find((p) => p.id === params.id);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { formatPrice } = useContext(CurrencyContext);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`);
    }
  }, []);

  if (!property) {
    notFound();
  }
  
  if (property.status === 'Off-plan') {
    return <OffPlanPropertyPage property={property} />;
  }

  const propertyImages = property.images.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);
  const recommendedProperties = properties.filter(p => p.id !== property.id).slice(0, 2);
  const PropertyTypeIcon = propertyTypeIcons[property.type] || propertyTypeIcons['Default'];
  const isForRent = property.transactionType === 'Rent';


  return (
    <div className="bg-background">
      <AnimateOnScroll>
        <section className="py-0 px-0 md:px-8 md:py-16">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[60vh]">
            {propertyImages.map((image, index) => {
              if (!image) return null;
              const isFirst = index === 0;
              return (
                <div key={image.id} className={cn(
                  "overflow-hidden rounded-lg",
                  isFirst ? "col-span-2 row-span-2" : "col-span-1 row-span-1 hidden md:block"
                )}>
                  <Image
                    src={image.imageUrl}
                    alt={`${property.title} image ${index + 1}`}
                    width={isFirst ? 1200 : 600}
                    height={isFirst ? 1200 : 600}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    data-ai-hint={image.imageHint}
                  />
                </div>
              )
            })}
          </div>
        </section>
      </AnimateOnScroll>

      <section className="pt-8">
        <div className="container mx-auto lg:grid lg:grid-cols-[64%,32%] lg:gap-[4%]">
          {/* Left Column */}
          <div className="w-full">
            <AnimateOnScroll>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-headline font-medium">{property.title}</h1>
                   {isForRent && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="text-sm p-0 h-auto text-muted-foreground hover:text-accent mt-2">
                          See upfront cost
                        </Button>
                      </DialogTrigger>
                      <UpfrontCostModal annualRent={property.price} />
                    </Dialog>
                  )}
                </div>
                <div className="text-right flex-shrink-0 pl-4">
                  <span className="text-3xl md:text-4xl font-bold text-accent convert-price" data-usd-price={property.price}>{formatPrice(property.price)}</span>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-md border-y py-4 mb-8">
                  <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-muted-foreground" /> <span> {property.location}</span></div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-muted-foreground" /> <span>{property.bedrooms} Beds</span></div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-muted-foreground" /> <span>{property.bathrooms} Baths</span></div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2"><Square className="w-5 h-5 text-muted-foreground" /> <span>{property.sqft.toLocaleString()} sqft</span></div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2"><PropertyTypeIcon className="w-5 h-5 text-muted-foreground" /> <span>{property.type}</span></div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
                <h2 className="text-3xl font-headline mb-4">Description</h2>
                <ReadMore text={property.description} />
            </AnimateOnScroll>

            <Separator className="my-12"/>
            
            <AnimateOnScroll delay={300}>
              <h2 className="text-3xl font-headline mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map(amenity => {
                      const Icon = amenityIcons[amenity];
                      return (
                          <Badge key={amenity} variant="outline" className="text-center justify-center p-3 text-sm rounded-lg flex items-center gap-2">
                              {Icon && <Icon className="w-4 h-4" />}
                              <span>{amenity}</span>
                          </Badge>
                      )
                  })}
              </div>
            </AnimateOnScroll>

            <Separator className="my-12"/>

            {/* Regulatory Information */}
            <AnimateOnScroll delay={400}>
              <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-accent"/> Regulatory Information</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2"><HandHelping className="w-4 h-4 mt-0.5"/> <strong>Reference ID:</strong> {property.referenceId || 'N/A'}</li>
                    <li className="flex gap-2"><Banknote className="w-4 h-4 mt-0.5"/> <strong>Trakheesi:</strong> {property.trakheesi || 'N/A'}</li>
                    <li className="flex gap-2"><LandPlot className="w-4 h-4 mt-0.5"/> <strong>RERA Permit:</strong> {property.reraPermit || 'N/A'}</li>
                  </ul>
                </div>
                <div className="text-center w-full sm:w-auto">
                    <p className="text-sm font-bold mb-2">DLD Permit</p>
                    {qrCodeUrl ? (
                        <Image src={qrCodeUrl} alt="DLD Permit QR Code" width={100} height={100} />
                    ) : (
                        <div className="w-[100px] h-[100px] bg-muted animate-pulse"></div>
                    )}
                </div>
              </div>
            </AnimateOnScroll>

            {!isForRent && (
              <>
                <Separator className="my-12"/>
                {/* Mortgage Calculator */}
                <AnimateOnScroll>
                    <MortgageCalculator propertyPrice={property.price}/>
                </AnimateOnScroll>
              </>
            )}

            <Separator className="my-12"/>
            
            {/* Location Map */}
            <AnimateOnScroll>
                <h2 className="text-3xl font-headline mb-6">Location</h2>
                <LocationMap />
            </AnimateOnScroll>
            
            {property.nearby && property.nearby.length > 0 && (
                <>
                    <Separator className="my-12" />
                    <AnimateOnScroll>
                        <h2 className="text-3xl font-headline mb-6">Nearby Landmarks</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {property.nearby.map((place) => (
                                <Card key={place.name} className="flex items-center gap-4 p-4">
                                    <div className="bg-muted p-3 rounded-lg">
                                        <MapPin className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{place.name}</p>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span>{place.time} away</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </AnimateOnScroll>
                </>
            )}

          </div>
          
          {/* Right Column (Agent Sidebar) */}
          <div className="hidden lg:block relative">
             <AgentSidebar />
          </div>
        </div>
      </section>
      
      {/* Agent Sidebar for Mobile */}
      <div className="lg:hidden container mx-auto mt-12 px-8">
        <AgentSidebar />
      </div>


      {/* Recommendations */}
      <AnimateOnScroll>
        <section className="bg-muted/30">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-6xl font-medium">You Might Also Like</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                {recommendedProperties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                ))}
                </div>
                <div className="text-center mt-16">
                    <Button asChild size="lg">
                        <Link href="/properties">View All Properties</Link>
                    </Button>
                </div>
            </div>
        </section>
      </AnimateOnScroll>
    </div>
  );
}
