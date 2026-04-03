import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { HeroSection } from "@/components/sections/hero-section";
import { LatestProjects } from "@/components/sections/latest-projects";
import { PartnersSection } from "@/components/sections/partners-section";
import { ServicesSection } from "@/components/sections/services-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { getProperties, getSiteConfig, getTestimonials } from "@/lib/api";
import { properties as fallbackProperties, testimonials as fallbackTestimonials } from "@/lib/data";

export default async function Home() {
  const [siteConfig, propertiesResponse, dynamicTestimonials] = await Promise.all([
    getSiteConfig(),
    getProperties({ limit: 24 }),
    getTestimonials(),
  ]);

  const properties = propertiesResponse.properties.length > 0 ? propertiesResponse.properties : fallbackProperties;
  const testimonials = dynamicTestimonials.length > 0 ? dynamicTestimonials : fallbackTestimonials;
  const featuredProperties = properties.filter(property => property.status !== 'Off-plan').slice(0, 3);

  return (
    <>
      <HeroSection categories={siteConfig.categories} />
      <AnimateOnScroll>
        <StatsSection stats={siteConfig.stats} />
      </AnimateOnScroll>
      <LatestProjects properties={properties} />
      <AnimateOnScroll>
        <PartnersSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ServicesSection />
      </AnimateOnScroll>
      <FeaturedProperties properties={featuredProperties} />
      <AnimateOnScroll>
        <TestimonialsSection testimonials={testimonials} />
      </AnimateOnScroll>
    </>
  );
}
