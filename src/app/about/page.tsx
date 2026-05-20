
'use client';

import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/shared/count-up";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { getSiteConfig, getTestimonials } from "@/lib/api";
import type { SiteConfig, Testimonial } from "@/lib/types";
import { prefixAgencyPath, resolveAgencySlugFromPathname } from "@/lib/agency-routing";
import { usePathname } from "next/navigation";

function normalizeTestimonials(input: unknown[]): Testimonial[] {
  const normalized: Testimonial[] = [];

  input.forEach((item, index) => {
    const testimonial = item as {
      id?: string;
      quote?: string | null;
      content?: string | null;
      author?: string | null;
      name?: string | null;
      clientName?: string | null;
      location?: string | null;
      property?: string | null;
      image?: string | null;
      imageId?: string | null;
      rating?: number | null;
    };

    const quote = testimonial.quote?.trim() || testimonial.content?.trim() || "";
    if (!quote) return;

    const author =
      testimonial.author?.trim() ||
      testimonial.name?.trim() ||
      testimonial.clientName?.trim() ||
      "Anonymous";

    normalized.push({
      id: testimonial.id || `${author}-${index}`,
      quote,
      author,
      location: testimonial.location?.trim() || testimonial.property?.trim() || undefined,
      image: testimonial.image?.trim() || testimonial.imageId?.trim() || null,
      rating: typeof testimonial.rating === "number" ? testimonial.rating : 5,
    });
  });

  return normalized;
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);

  const heroImage = PlaceHolderImages.find((img) => img.id === 'about-hero');
  const founderImage = PlaceHolderImages.find((img) => img.id === 'founder-photo');
  const ctaImage = PlaceHolderImages.find((img) => img.id === 'cta-background');
  const displayName =
    siteConfig?.branding?.displayName || siteConfig?.organization.name || 'Agency Website';
  const aboutCompany =
    siteConfig?.profile?.aboutCompany?.trim()
    || siteConfig?.branding?.bio?.trim()
    || `${displayName} helps buyers, sellers, renters, and investors make confident real estate decisions with clear advice and responsive support.`;
  const mission =
    siteConfig?.profile?.mission?.trim()
    || `${displayName} is committed to making every property decision clearer, calmer, and better informed for the clients we serve.`;
  const vision =
    siteConfig?.profile?.vision?.trim()
    || `We envision ${displayName} as a public-facing real estate brand people trust for current opportunities, responsive advice, and polished service.`;
  const officeAddress = siteConfig?.profile?.officeAddress?.trim() || siteConfig?.featuredAreas?.slice(0, 3).join(', ');
  const officeTimings = siteConfig?.profile?.officeTimings?.trim() || null;
  const founderName = siteConfig?.leadAgent?.name || `${displayName} Team`;
  const founderTagline = siteConfig?.leadAgent?.tagline || 'Lead advisor';
  const stats = [
    { value: siteConfig?.stats?.totalListings ?? 0, suffix: '+', label: 'Live Listings' },
    { value: siteConfig?.stats?.activeAgents ?? 0, suffix: '+', label: 'Active Agents' },
    { value: siteConfig?.stats?.offPlanListings ?? 0, suffix: '+', label: 'Off-plan Launches' },
    { value: siteConfig?.stats?.readyListings ?? 0, suffix: '+', label: 'Ready Homes' },
  ];


  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      // Start effect when the top of the hero is at the top of the viewport
      const start = rect.top + window.scrollY;
      const end = start + hero.offsetHeight;

      if (window.scrollY >= start && window.scrollY <= end) {
        const progress = (window.scrollY - start) / (hero.offsetHeight * 0.75);
        setScrollProgress(Math.min(progress, 1));
      } else if (window.scrollY < start) {
        setScrollProgress(0);
      } else {
        setScrollProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadPageData() {
      const [nextSiteConfig, nextTestimonials] = await Promise.all([
        getSiteConfig(agencySlug),
        getTestimonials(agencySlug),
      ]);
      if (active) {
        setSiteConfig(nextSiteConfig);
        setTestimonials(normalizeTestimonials(nextTestimonials));
      }
    }

    void loadPageData();

    return () => {
      active = false;
    };
  }, [agencySlug]);

  const scale = 1 + scrollProgress * 0.5;
  const opacity = 1 - scrollProgress * 2;


  return (
    <div className="bg-background">
      {/* 1. Page Hero */}
      <div ref={heroRef} className="relative h-[120vh] w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {heroImage && (
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `scale(${scale})` }}
            >
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          )}

          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-8"
            style={{ opacity: Math.max(0, opacity) }}
          >
            <h1 className="text-6xl md:text-8xl font-bold font-sans">
              We are {displayName}.
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-balance">
              {aboutCompany}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Our Philosophy */}
      <section>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
          <div className="md:col-span-2">
            <AnimateOnScroll>
              <h2 className="text-5xl md:text-6xl font-headline">Mission &amp; Vision</h2>
            </AnimateOnScroll>
          </div>
          <div className="md:col-span-3">
            <AnimateOnScroll delay={100}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-card/60 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Our Mission</p>
                  <p className="mt-4 text-base md:text-lg text-muted-foreground">{mission}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-card/60 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Our Vision</p>
                  <p className="mt-4 text-base md:text-lg text-muted-foreground">{vision}</p>
                </div>
              </div>
              <div className="mt-6 space-y-6 text-base md:text-lg text-muted-foreground">
                {officeTimings || officeAddress ? (
                  <p>
                    {officeAddress ? `${displayName} operates from ${officeAddress}. ` : ''}
                    {officeTimings ? `Office timings: ${officeTimings}.` : 'Our public website stays synced directly with Broker OS.'}
                  </p>
                ) : null}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 3. Key Statistics */}
      <section>
        <div className="container mx-auto">
          <AnimateOnScroll>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-accent/10 dark:bg-transparent p-4 md:p-8 rounded-lg text-center">
                  <h3 className="text-4xl sm:text-5xl md:text-7xl font-bold font-headline text-accent">
                    <CountUp end={stat.value} duration={2} />
                    {stat.suffix}
                  </h3>
                  <p className="text-accent mt-2 text-sm sm:text-base">{stat.label}</p>
                </Card>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 4. Founder's Feature */}
      <section>
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <AnimateOnScroll className="overflow-hidden rounded-lg">
            {founderImage && (
              <Image
                src={founderImage.imageUrl}
                alt={founderImage.description}
                width={800}
                height={1000}
                className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-500 ease-in-out hover:scale-105"
                data-ai-hint={founderImage.imageHint}
              />
            )}
          </AnimateOnScroll>
          <div className="space-y-6 md:space-y-8">
            <AnimateOnScroll delay={100}>
              <blockquote className="text-2xl md:text-4xl font-headline italic text-balance">
                &ldquo;Every public page, listing, and contact point should feel as polished as the service behind it.&rdquo;
              </blockquote>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="text-base md:text-lg text-muted-foreground">
                {siteConfig?.leadAgent?.bio?.trim()
                  || `${displayName} combines agent expertise, live inventory, and organization-managed branding so clients always see current listings, current contacts, and a consistent agency identity.`}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={300}>
              <p className="text-base md:text-lg font-semibold">{founderName}{founderTagline ? `, ${founderTagline}` : ''}</p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <AnimateOnScroll>
        <TestimonialsSection testimonials={testimonials} />
      </AnimateOnScroll>

      {/* 6. Final Call to Action */}
      <section className="relative py-24 md:py-32">
        {ctaImage && (
          <Image
            src={ctaImage.imageUrl}
            alt={ctaImage.description}
            fill
            className="object-cover"
            data-ai-hint={ctaImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto relative z-10 text-center text-white">
          <AnimateOnScroll>
            <h2 className="text-4xl md:text-6xl font-headline mb-8 text-balance">Ready to start your journey?</h2>
            <Button size="lg" asChild>
              <Link href={prefixAgencyPath('/properties', agencySlug)}>
                Explore Properties
                <span className="group-hover:translate-x-1 transition-transform duration-300 ml-2 hidden sm:inline">↗</span>
              </Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
