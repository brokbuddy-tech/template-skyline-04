import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

export default function Home() {
  return (
    <>
      <HeroSection />
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
