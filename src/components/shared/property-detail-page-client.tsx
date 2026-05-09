'use client';

import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Bath, Square, MapPin, Building, LandPlot, HandHelping, Banknote, ShieldCheck, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MortgageCalculator } from '@/components/shared/mortgage-calculator';
import { PropertyCard } from '@/components/shared/property-card';
import { AnimateOnScroll } from '@/components/animate-on-scroll';
import { CurrencyContext } from '@/context/currency-context';
import { amenityIcons } from '@/lib/amenity-icons';
import { ReadMore } from '@/components/shared/read-more';
import { AgentSidebar } from '@/components/shared/agent-sidebar';
import dynamic from 'next/dynamic';

const DynamicLocationMap = dynamic(
  () => import('@/components/shared/location-map').then(mod => ({ default: mod.LocationMap })),
  { ssr: false, loading: () => <div className="leaflet-property-map relative h-96 w-full overflow-hidden rounded-lg border border-border bg-muted/35 animate-pulse" /> }
);
import { LiveOffPlanPropertyPage } from '@/components/shared/live-off-plan-property-page';
import { OffPlanHeroGallery } from '@/components/shared/off-plan-hero-gallery';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UpfrontCostModal } from '@/components/shared/upfront-cost-modal';
import { Card } from '@/components/ui/card';
import { FaqAccordion } from '@/components/shared/faq-accordion';
import type { Property, PropertyAgent } from '@/lib/types';
import { prefixAgencyPath, resolveAgencySlugFromPathname } from '@/lib/agency-routing';
import { usePathname } from 'next/navigation';

const propertyTypeIcons: Record<string, React.ElementType> = {
  House: Building,
  Apartment: Building,
  Penthouse: Building,
  Villa: Building,
  Land: LandPlot,
  Default: Building,
};

const rentFaqs = [
  {
    question: 'What documents are typically required to rent a property?',
    answer: 'Tenants usually need a passport copy, Emirates ID, visa copy, and proof of income or bank statements depending on the landlord.'
  },
  {
    question: 'Who is responsible for utility registration?',
    answer: 'Utility registration is typically handled by the tenant unless the tenancy agreement states otherwise.'
  },
  {
    question: 'What is the standard security deposit amount?',
    answer: 'Security deposits are commonly 5% for unfurnished homes and 10% for furnished homes.'
  },
  {
    question: 'How does the tenancy contract renewal process work?',
    answer: 'Renewal terms are usually discussed ahead of contract expiry, with any rent revisions following the local rental index and notice rules.'
  }
];

const saleFaqs = [
  {
    question: 'What is the difference between freehold and leasehold?',
    answer: 'Freehold gives long-term ownership rights, while leasehold grants the right to occupy the property for a defined number of years.'
  },
  {
    question: 'What upfront purchase costs should I expect?',
    answer: 'Buyers should budget for transfer fees, trustee charges, agency fees, mortgage fees when applicable, and potential developer NOC fees.'
  },
  {
    question: 'Can non-residents obtain a mortgage?',
    answer: 'Yes, non-residents can often obtain financing, though the loan-to-value ratio is usually lower than for UAE residents.'
  },
  {
    question: 'What does off-plan mean?',
    answer: 'Off-plan means the property is purchased before completion, often with staged payment plans and a future handover date.'
  }
];

export function PropertyDetailPageClient({
  property,
  recommendedProperties,
  fallbackAgent,
}: {
  property: Property;
  recommendedProperties: Property[];
  fallbackAgent?: PropertyAgent;
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { formatPrice } = useContext(CurrencyContext);
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`);
  }, []);

  if (property.status === 'Off-plan') {
    return <LiveOffPlanPropertyPage property={property} />;
  }

  const PropertyTypeIcon = propertyTypeIcons[property.type] || propertyTypeIcons.Default;
  const isForRent = property.transactionType === 'Rent';
  const faqData = isForRent ? rentFaqs : saleFaqs;
  const displayAgent = property.agent || fallbackAgent;

  return (
    <div className="bg-background">
      <AnimateOnScroll>
        <OffPlanHeroGallery property={property} badgeText="Property Gallery" mapHref="#property-location" />
      </AnimateOnScroll>

      <div className="container mx-auto px-4 sm:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-8">
            <section className="pt-8 px-0">
              <AnimateOnScroll>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                  <div className="mb-2 sm:mb-0">
                    <h1 className="text-3xl md:text-5xl font-headline font-medium">{property.title}</h1>
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
                  <div className="sm:text-right flex-shrink-0 sm:pl-4">
                    <span className="text-2xl md:text-4xl font-bold text-accent">{formatPrice(property.price)}</span>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={100}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-md border-y py-4 mb-8">
                  <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-muted-foreground" /> <span>{property.location}</span></div>
                  <Separator orientation="vertical" className="h-5 hidden sm:block" />
                  <div className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-muted-foreground" /> <span>{property.bedrooms || 'Studio'} Beds</span></div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-muted-foreground" /> <span>{property.bathrooms} Baths</span></div>
                  <Separator orientation="vertical" className="h-5 hidden sm:block" />
                  <div className="flex items-center gap-2"><Square className="w-5 h-5 text-muted-foreground" /> <span>{property.sqft.toLocaleString()} sqft</span></div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2"><PropertyTypeIcon className="w-5 h-5 text-muted-foreground" /> <span>{property.type}</span></div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <h2 className="text-3xl font-headline mb-4">Description</h2>
                <ReadMore text={property.description} />
              </AnimateOnScroll>

              <Separator className="my-12" />

              {property.amenities.length > 0 && (
                <>
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
                        );
                      })}
                    </div>
                  </AnimateOnScroll>
                  <Separator className="my-12" />
                </>
              )}

              <AnimateOnScroll delay={400}>
                <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-accent" /> Regulatory Information</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2"><HandHelping className="w-4 h-4 mt-0.5" /> <strong>Reference ID:</strong> {property.referenceId || 'N/A'}</li>
                      <li className="flex gap-2"><Banknote className="w-4 h-4 mt-0.5" /> <strong>Trakheesi:</strong> {property.trakheesi || 'N/A'}</li>
                      <li className="flex gap-2"><LandPlot className="w-4 h-4 mt-0.5" /> <strong>RERA Permit:</strong> {property.reraPermit || 'N/A'}</li>
                    </ul>
                  </div>
                  <div className="text-center w-full flex flex-col items-center sm:w-auto sm:items-end">
                    <p className="text-sm font-bold mb-2">DLD Permit</p>
                    {qrCodeUrl ? (
                      <Image src={qrCodeUrl} alt="DLD Permit QR Code" width={100} height={100} />
                    ) : (
                      <div className="w-[100px] h-[100px] bg-muted animate-pulse" />
                    )}
                  </div>
                </div>
              </AnimateOnScroll>

              {!isForRent && (
                <>
                  <Separator className="my-12" />
                  <AnimateOnScroll>
                    <MortgageCalculator propertyPrice={property.price} />
                  </AnimateOnScroll>
                </>
              )}

              <Separator className="my-12" />

              <AnimateOnScroll>
                <section id="property-location">
                  <h2 className="text-3xl font-headline mb-6">Location</h2>
                  <DynamicLocationMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    locationLabel={property.location}
                    addressLabel={property.mapAddress}
                  />
                </section>
              </AnimateOnScroll>

              {property.nearby && property.nearby.length > 0 && (
                <>
                  <Separator className="my-12" />
                  <AnimateOnScroll>
                    <h2 className="text-3xl font-headline mb-6">Nearby Landmarks</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {property.nearby.map(place => (
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
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-8">
              <AgentSidebar agent={displayAgent} property={property} />
            </div>
          </div>
        </div>
      </div>

      <AnimateOnScroll>
        <section className="bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-medium">You Might Also Like</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {recommendedProperties.map(item => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
            <div className="text-center mt-16">
              <Button asChild size="lg">
                <Link href={prefixAgencyPath('/properties', agencySlug)}>View All Properties</Link>
              </Button>
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      <FaqAccordion propertyName={property.title} faqs={faqData} />
    </div>
  );
}
