import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { HeroSection } from "@/components/sections/hero-section";
import { LatestProjects } from "@/components/sections/latest-projects";
import { PartnersSection } from "@/components/sections/partners-section";
import { ServicesSection } from "@/components/sections/services-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { getProperties, getSiteConfig, getTestimonials } from "@/lib/api";
import { testimonials as fallbackTestimonials } from "@/lib/data";

export async function HomePageContent({ agencySlug }: { agencySlug?: string | null }) {
  const [siteConfig, propertiesResponse, dynamicTestimonials] = await Promise.all([
    getSiteConfig(agencySlug),
    getProperties({ limit: 24 }, agencySlug),
    getTestimonials(agencySlug),
  ]);

  const properties = propertiesResponse.properties.length > 0 ? propertiesResponse.properties : [];
  const testimonials = dynamicTestimonials.length > 0 ? dynamicTestimonials : fallbackTestimonials;
  const featuredProperties = properties.filter(property => property.status !== 'Off-plan').slice(0, 3);
  const displayName =
    siteConfig.branding?.displayName || siteConfig.organization.name || 'Agency Website';
  const heroTagline =
    siteConfig.branding?.tagline
    || siteConfig.profile?.aboutCompany
    || siteConfig.leadAgent?.bio
    || null;

  return (
    <>
      <HeroSection
        categories={siteConfig.categories}
        agencyName={displayName}
        tagline={heroTagline}
      />
      <AnimateOnScroll>
        <StatsSection stats={siteConfig.stats} agencyName={displayName} agencySlug={agencySlug} />
      </AnimateOnScroll>
      <LatestProjects properties={properties} agencySlug={agencySlug} />
      <AnimateOnScroll>
        <PartnersSection />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ServicesSection />
      </AnimateOnScroll>
      <FeaturedProperties properties={featuredProperties} agencySlug={agencySlug} />
      <AnimateOnScroll>
        <TestimonialsSection testimonials={testimonials} />
      </AnimateOnScroll>
    </>
  );
}

export default async function Home() {
  return <HomePageContent />;
}
