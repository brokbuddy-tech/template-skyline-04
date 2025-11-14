import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { HeroSection } from "@/components/sections/hero-section";
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
      <AnimateOnScroll>
        <PartnersSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ServicesSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <FeaturedProperties />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <TestimonialsSection />
      </AnimateOnScroll>
    </>
  );
}
