import Link from 'next/link';
import Image from 'next/image';
import type { Property } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimateOnScroll } from '../animate-on-scroll';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === property.images[0]);

  return (
    <AnimateOnScroll>
      <Link href={`/properties/${property.id}`} className="group block" data-hoverable="true">
        <div className="overflow-hidden mb-4">
          {image && (
            <Image
              src={image.imageUrl}
              alt={property.title}
              width={800}
              height={600}
              className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-500 ease-in-out group-hover:scale-105"
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
        <div>
          <h3 className="text-2xl font-headline font-medium">{property.title}</h3>
          <p className="text-muted-foreground">{property.location}</p>
        </div>
      </Link>
    </AnimateOnScroll>
  );
}
