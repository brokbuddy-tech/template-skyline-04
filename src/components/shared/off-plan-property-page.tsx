
'use client';

import type { Property } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { EmaarLogo } from '@/components/shared/developer-logos';
import {
  ChevronRight,
  Check,
  HelpCircle,
  FileDown,
  MessageSquare,
  ShieldCheck,
  HandHelping,
  Banknote,
  LandPlot,
  MapPin,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { OffPlanHeroGallery } from './off-plan-hero-gallery';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PropertyDescriptionDisplay } from './property-description-display';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { amenityIcons } from '@/lib/amenity-icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LocationMap } from './location-map';
import { Card } from '../ui/card';

interface OffPlanPropertyPageProps {
  property: Property;
}

export function OffPlanPropertyPage({ property }: { property: Property }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const masterplanImage = PlaceHolderImages.find((img) => img.id === 'masterplan');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`);
    }
  }, []);
  
  const timelineSteps = [
    {
      label: 'Project Announcement',
      date: 'May 20, 2025',
      completed: true,
    },
    {
      label: 'Booking Started',
      date: 'June 10, 2025',
      completed: true,
    },
    {
      label: 'Construction Started',
      date: 'June 11, 2025',
      completed: true,
    },
    {
      label: 'Expected Completion',
      date: 'July 31, 2029',
      completed: false,
    },
  ];

  const nearbyPlaces = [
      { name: 'Downtown Dubai', time: '10 min' },
      { name: 'Burj Khalifa', time: '10 min' },
      { name: 'Dubai International Airport', time: '15 min' },
      { name: 'Business Bay', time: '20 min' },
  ];

  return (
    <div className="bg-background">
      <OffPlanHeroGallery property={property} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-x-8">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8">
            {/* Section A: Header & Developer Info */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-[#1E1E2C] mb-2">
                Launch Price 1.9M AED*
              </h1>
              <p className="text-xs text-gray-500">
                *Prices and availability subject to change without notice.
              </p>

              <div className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-md border border-gray-200">
                    <EmaarLogo className="w-16 h-auto" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E1E2C]">
                      Emaar Properties
                    </p>
                    <Link
                      href="#"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View developer details
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Key Information Grid */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#1E1E2C] mb-6">
                Key information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Delivery Date
                  </p>
                  <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                    July 2029
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Sale Starts
                  </p>
                  <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                    June 10, 2025
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-base text-blue-600 font-semibold mt-1 hover:underline cursor-pointer">
                    Dubai, Dubai Creek Harbour...
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Payment Plan
                  </p>
                  <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                    10/70/20
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Buildings
                  </p>
                  <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                    1
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Property Types
                  </p>
                  <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                    Apartment, Townhouse
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Govt Fee
                    </p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3 h-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Government fees and taxes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                    4%
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Ownership
                    </p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3 h-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ownership type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-base text-[#1E1E2C] font-semibold mt-1">
                    Freehold
                  </p>
                </div>
              </div>
            </div>

            {/* Section C: Payment Plan Visualization */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#1E1E2C] mb-6">
                Payment plan
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="bg-gray-50 rounded-xl p-6 flex-1 text-center border border-gray-100 min-w-[140px] w-full">
                  <p className="text-3xl font-bold text-[#1E1E2C]">10%</p>
                  <p className="text-sm font-semibold text-[#1E1E2C] mt-1">
                    Down payment
                  </p>
                  <p className="text-xs text-gray-500 mt-1">At sales launch</p>
                </div>
                <ChevronRight className="text-gray-300 hidden md:block" />
                <div className="bg-gray-50 rounded-xl p-6 flex-1 text-center border border-gray-100 min-w-[140px] w-full">
                  <p className="text-3xl font-bold text-[#1E1E2C]">70%</p>
                  <p className="text-sm font-semibold text-[#1E1E2C] mt-1">
                    During construction
                  </p>
                  <p className="text-xs text-gray-500 mt-1">7 Installments</p>
                </div>
                <ChevronRight className="text-gray-300 hidden md:block" />
                <div className="bg-gray-50 rounded-xl p-6 flex-1 text-center border border-gray-100 min-w-[140px] w-full">
                  <p className="text-3xl font-bold text-[#1E1E2C]">20%</p>
                  <p className="text-sm font-semibold text-[#1E1E2C] mt-1">
                    On handover
                  </p>
                  <p className="text-xs text-gray-500 mt-1">July 2029</p>
                </div>
              </div>
            </div>

            {/* Section D: Project Timeline */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#1E1E2C] mb-6">
                Project timeline
              </h2>
              <div className="bg-[#F8FAFC] rounded-2xl p-8">
                <div className="relative">
                  {timelineSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-6 pb-8 last:pb-0"
                    >
                      <div className="relative">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-blue-600'
                              : 'bg-white border-2 border-gray-300'
                          }`}
                        >
                          {step.completed && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        {index < timelineSteps.length - 1 && (
                          <div
                            className={`absolute left-1/2 -translate-x-1/2 h-full w-0.5 ${
                              step.completed
                                ? 'bg-blue-600'
                                : 'border-l-2 border-dashed border-gray-300'
                            }`}
                            style={{ top: '1.25rem' }}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1E1E2C]">
                          {step.label}
                        </p>
                        <p className="text-sm text-gray-500">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Regulatory Information */}
            <div className="mb-12">
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
            </div>

            <Separator className="my-12"/>

            {/* Description Section */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-[#1E1E2C] mb-4">About This Project</h2>
                <div className="text-muted-foreground space-y-4 line-clamp-3">
                  <PropertyDescriptionDisplay description={property.description} />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-accent p-0 mt-2">Read Full Description</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-headline">{property.title}</DialogTitle>
                    </DialogHeader>
                    <div className="prose dark:prose-invert max-w-full">
                      <PropertyDescriptionDisplay description={property.description} />
                    </div>
                  </DialogContent>
                </Dialog>
            </div>
            
            <Separator className="my-12"/>

            {/* Amenities Section */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#1E1E2C] mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map(amenity => {
                      const Icon = amenityIcons[amenity];
                      return (
                          <Badge key={amenity} variant="outline" className="text-center justify-center p-3 text-sm rounded-lg flex items-center gap-2 border-gray-200 bg-gray-50">
                              {Icon && <Icon className="w-4 h-4 text-accent" />}
                              <span>{amenity}</span>
                          </Badge>
                      )
                  })}
              </div>
            </div>

            <Separator className="my-12"/>

            {/* Masterplan Section */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#1E1E2C] mb-6">Masterplan</h2>
              {masterplanImage && (
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <Image
                    src={masterplanImage.imageUrl}
                    alt={masterplanImage.description}
                    width={1600}
                    height={900}
                    className="w-full h-auto object-cover"
                    data-ai-hint={masterplanImage.imageHint}
                  />
                </div>
              )}
            </div>
            
            <Separator className="my-12"/>

            {/* Location Map Section */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-[#1E1E2C] mb-6">Location</h2>
                <LocationMap />
            </div>

            <Separator className="my-12" />

            {/* Nearby Places Section */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[#1E1E2C] mb-6">Nearby Places</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nearbyPlaces.map((place) => (
                  <Card key={place.name} className="flex items-center gap-4 p-4 bg-gray-50 border-gray-100">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
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
            </div>

          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-24">
              <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-[#1E1E2C] mb-4">
                  Interested in Lyvia?
                </h3>
                <form className="space-y-4">
                  <Input placeholder="Name" />
                  <Input placeholder="Phone" type="tel" />
                  <Input placeholder="Email" type="email" />
                  <ToggleGroup type="single" defaultValue="end-user" className="w-full">
                    <ToggleGroupItem value="investor" className="w-full">I am an Investor</ToggleGroupItem>
                    <ToggleGroupItem value="end-user" className="w-full">I am an End User</ToggleGroupItem>
                  </ToggleGroup>
                  <Button className="w-full bg-[#1E1E2C] hover:bg-[#1E1E2C]/90 text-white">
                    Register Interest
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileDown className="w-4 h-4 mr-2" />
                    Download Brochure
                  </Button>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp Agent
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

    

    
