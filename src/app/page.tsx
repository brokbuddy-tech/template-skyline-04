import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { HeroSection } from "@/components/sections/hero-section";
import { LatestProjects } from "@/components/sections/latest-projects";
import { PartnersSection } from "@/components/sections/partners-section";
import { ServicesSection } from "@/components/sections/services-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AnimateOnScroll>
        <StatsSection />
      </AnimateOnScroll>
      <LatestProjects />
      <AnimateOnScroll>
        <PartnersSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ServicesSection />
      </AnimateOnScroll>
      <FeaturedProperties />
      <AnimateOnScroll>
        <TestimonialsSection />
      </AnimateOnScroll>
    </>
  );
}
