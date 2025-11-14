import { services } from '@/lib/data';
import { AnimateOnScroll } from '../animate-on-scroll';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HoneycombLoader } from '../shared/honeycomb-loader';

export function ServicesSection() {
  const image = PlaceHolderImages.find((img) => img.id === 'services-person');

  return (
    <section className="bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll className="lg:pr-8">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-headline font-medium text-balance">
                Discover the range of real estate <span className="text-primary">services</span> we offer
              </h2>
            </div>
            {image && (
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={800}
                  height={1000}
                  className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-500 ease-in-out hover:scale-105"
                  data-ai-hint={image.imageHint}
                />
              </div>
            )}
          </AnimateOnScroll>
          <div className="relative">
            <div className='absolute top-0 right-0'>
              <HoneycombLoader />
            </div>
            <div className="flex flex-col">
              {services.map((service, index) => (
                <AnimateOnScroll
                  key={service.title}
                  delay={index * 150}
                  className="border-b last:border-b-0 py-8"
                >
                  <div className="flex gap-8">
                    <span className="text-4xl font-bold font-headline text-muted-foreground/50">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-2xl font-headline font-bold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-balance">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
