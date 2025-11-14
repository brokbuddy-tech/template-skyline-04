import { properties } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { BedDouble, Bath, Square, MapPin, Eye, FileDown, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MortgageCalculator } from "@/components/shared/mortgage-calculator";
import { PropertyCard } from "@/components/shared/property-card";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === params.id);

  if (!property) {
    notFound();
  }

  const propertyImages = property.images.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);
  const recommendedProperties = properties.filter(p => p.id !== property.id).slice(0, 2);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };


  return (
    <div className="bg-background">
      {/* Image Grid Hero */}
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

      {/* Action Bar */}
      <AnimateOnScroll>
        <div className="container mx-auto my-8">
            <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
                <a href="#" className="flex items-center gap-2 hover:text-accent">
                    <Eye className="w-4 h-4" /> View Virtual Tour
                </a>
                <a href="#" className="flex items-center gap-2 hover:text-accent">
                    <FileDown className="w-4 h-4" /> Download Brochure
                </a>
                <a href="#" className="flex items-center gap-2 hover:text-accent">
                    <QrCode className="w-4 h-4" /> Get QR Code
                </a>
            </div>
        </div>
      </AnimateOnScroll>

      {/* Main Content */}
      <section className="pt-8">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <AnimateOnScroll>
                <h1 className="text-5xl md:text-6xl font-headline font-medium mb-2">{property.title}</h1>
                <p className="text-lg text-muted-foreground flex items-center gap-2 mb-8">
                    <MapPin className="w-5 h-5" /> {property.location}
                </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="flex items-center gap-6 text-lg border-y py-6 mb-8">
                  <div className="flex items-center gap-2"><BedDouble className="w-6 h-6 text-muted-foreground" /> <span>{property.bedrooms} Beds</span></div>
                  <div className="flex items-center gap-2"><Bath className="w-6 h-6 text-muted-foreground" /> <span>{property.bathrooms} Baths</span></div>
                  <div className="flex items-center gap-2"><Square className="w-6 h-6 text-muted-foreground" /> <span>{property.sqft.toLocaleString()} sqft</span></div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
                <h2 className="text-3xl font-headline mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed text-balance">{property.description}</p>
            </AnimateOnScroll>
            
            <AnimateOnScroll delay={300}>
              <Separator className="my-12"/>

              <h2 className="text-3xl font-headline mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map(amenity => (
                      <Badge key={amenity} variant="outline" className="text-center justify-center p-3 text-sm rounded-lg">
                          {amenity}
                      </Badge>
                  ))}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right Column (Sticky) */}
          <div className="relative">
            <div className="sticky top-28 space-y-8">
                <AnimateOnScroll delay={400}>
                    <Card className="border-accent">
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                <span className="text-4xl font-bold text-accent">{formatPrice(property.price)}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Calendar mode="single" className="rounded-md border" />
                             <Select>
                                <SelectTrigger><SelectValue placeholder="Guests" /></SelectTrigger>
                                <SelectContent>
                                    {[...Array(10)].map((_, i) => (
                                        <SelectItem key={i} value={`${i + 1}`}>{i + 1} Guest{i > 0 ? 's' : ''}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button size="lg" className="w-full">Book Now</Button>
                        </CardContent>
                    </Card>
                </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Mortgage Calculator */}
      <AnimateOnScroll>
        <section>
            <div className="container mx-auto">
                <MortgageCalculator propertyPrice={property.price}/>
            </div>
        </section>
      </AnimateOnScroll>

      {/* Recommendations */}
      <AnimateOnScroll>
        <section className="bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-medium">You Might Also Like</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                {recommendedProperties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                ))}
                </div>
            </div>
        </section>
      </AnimateOnScroll>

    </div>
  );
}
