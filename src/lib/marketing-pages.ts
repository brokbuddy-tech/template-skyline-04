export type SkylineServiceContent = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  highlights: string[];
};

export type SkylineDeveloperContent = {
  slug: string;
  name: string;
  specialty: string;
  summary: string;
  highlights: string[];
};

export const SKYLINE_SERVICE_PAGES: SkylineServiceContent[] = [
  {
    slug: 'asset-management',
    title: 'Asset Management',
    eyebrow: 'Client Services',
    summary:
      'Portfolio oversight, leasing coordination, and reporting workflows tailored for owners who want reliable performance without day-to-day friction.',
    highlights: [
      'Owner reporting designed around occupancy, yield, and maintenance visibility.',
      'Hands-on leasing support with broker coordination and tenant communication.',
      'A clear service path from valuation through listing, onboarding, and renewal.',
    ],
  },
  {
    slug: 'holiday-homes',
    title: 'Holiday Homes',
    eyebrow: 'Client Services',
    summary:
      'A high-touch short-stay program that blends positioning, guest readiness, and pricing support for seasonal demand across Dubai.',
    highlights: [
      'Launch support for furnished stock entering the short-stay market.',
      'Presentation, booking-readiness, and occupancy-focused guidance.',
      'A brand-safe hospitality layer that complements the agency website journey.',
    ],
  },
  {
    slug: 'property-valuation',
    title: 'Property Valuation',
    eyebrow: 'Client Services',
    summary:
      'Evidence-led pricing guidance using active market sentiment, comparable inventory, and listing presentation to help owners move decisively.',
    highlights: [
      'Advisory around launch pricing, repositioning, and seller expectations.',
      'Market context that supports both ready and off-plan conversations.',
      'A fast path into lead capture when visitors want a valuation callback.',
    ],
  },
  {
    slug: 'investment-advisory',
    title: 'Investment Advisory',
    eyebrow: 'Advisory',
    summary:
      'Investment planning built around acquisition timing, portfolio fit, and realistic yield conversations for local and overseas buyers.',
    highlights: [
      'Location and product selection based on strategy, not generic inventory pushes.',
      'Guidance across end-user, yield, and long-hold decision paths.',
      'Direct handoff from discovery pages into agent-led advisory conversations.',
    ],
  },
  {
    slug: 'mortgage-advisory',
    title: 'Mortgage Advisory',
    eyebrow: 'Advisory',
    summary:
      'Financing guidance that helps buyers understand affordability, documentation, and decision timing before they commit to a property.',
    highlights: [
      'Early qualification support that reduces drop-off during property discovery.',
      'Clear prep around paperwork, timelines, and lender-facing readiness.',
      'A practical bridge between search intent, affordability, and agent follow-up.',
    ],
  },
];

export const SKYLINE_DEVELOPER_PAGES: SkylineDeveloperContent[] = [
  {
    slug: 'emaar',
    name: 'Emaar',
    specialty: 'Master-planned communities and branded destinations',
    summary:
      'A market-defining developer known for flagship communities, waterfront destinations, and premium launch activity that consistently attracts global attention.',
    highlights: [
      'Strong recognition among end users and international investors.',
      'Frequent fit for prime, lifestyle-led, and off-plan discovery journeys.',
      'Useful anchor brand for agency landing pages focused on trust and prestige.',
    ],
  },
  {
    slug: 'nakheel',
    name: 'Nakheel',
    specialty: 'Coastal districts and destination-scale communities',
    summary:
      'Best known for high-visibility waterfront and island-led development, with products that appeal to lifestyle buyers and long-term hold strategies alike.',
    highlights: [
      'Strong appeal for branded location narratives and destination marketing.',
      'A natural match for buyers prioritizing coastal access and landmark addresses.',
      'Works well inside public template pages that emphasize area-led storytelling.',
    ],
  },
  {
    slug: 'danube',
    name: 'Danube',
    specialty: 'Accessible launches and payment-plan-led off-plan demand',
    summary:
      'A developer frequently associated with value-led off-plan launches, broad buyer reach, and flexible payment-plan conversations.',
    highlights: [
      'Often resonates with first-time investors and value-conscious buyers.',
      'Useful for lead funnels centered on affordability and launch momentum.',
      'Pairs naturally with mortgage and investment advisory CTAs.',
    ],
  },
  {
    slug: 'select-group',
    name: 'Select Group',
    specialty: 'Design-forward residential and waterfront projects',
    summary:
      'Recognized for polished residential product, premium finishing, and a strong fit for buyers seeking contemporary design in established districts.',
    highlights: [
      'Effective for premium positioning without relying on generic luxury copy.',
      'Frequently aligned with buyers seeking design quality and modern amenities.',
      'A strong inclusion for agency pages built around curated residential supply.',
    ],
  },
];

export function getSkylineServiceContent(serviceSlug: string) {
  return SKYLINE_SERVICE_PAGES.find((service) => service.slug === serviceSlug) ?? null;
}

export function getSkylineDeveloperContent(developerSlug: string) {
  return SKYLINE_DEVELOPER_PAGES.find((developer) => developer.slug === developerSlug) ?? null;
}
