import { notFound } from 'next/navigation';
import { AgentProfileExperience } from '@/components/shared/agent-profile-experience';
import { getAgentProfile, getProperties, getSiteConfigOrNull, toSocialUrl } from '@/lib/api';
import { resolveImage, type ResolvedImage } from '@/lib/property-media';
import type { Property } from '@/lib/types';
import { normalizeBrokerReviewCards } from '@/lib/reviews';

function getSummary(
  agentBio?: string | null,
  agentTagline?: string | null,
  aboutCompany?: string | null,
  agentName?: string,
  agencyName?: string,
) {
  return (
    agentBio
    || agentTagline
    || aboutCompany
    || `Connect with ${agentName || 'this agent'} at ${agencyName || 'the organization'} for tailored property guidance.`
  );
}

function getQuickFact(value?: string | number | null) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  const trimmed = value.trim();
  return trimmed || null;
}

function buildBiography(summary: string, aboutCompany?: string | null, officeAddress?: string | number | null) {
  const normalizedAbout = aboutCompany?.trim();
  const normalizedSummary = summary.trim();
  const fallbackSecondParagraph = officeAddress
    ? `Clients looking for confident, well-guided decisions around ${officeAddress} can expect a calm, detail-oriented process from first conversation to final closing.`
    : "Every conversation is shaped around the client's priorities, whether that means protecting value, unlocking upside, or finding a home that genuinely fits the next chapter.";

  return [
    normalizedSummary,
    normalizedAbout && normalizedAbout !== normalizedSummary
      ? normalizedAbout
      : fallbackSecondParagraph,
  ];
}

function extractArea(location?: string | null) {
  const normalized = location?.trim();
  if (!normalized) return null;
  return normalized.split(',')[0]?.trim() || normalized;
}

function formatCompactPortfolio(value: number) {
  if (value >= 1_000_000_000) {
    return `AED ${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  }

  if (value >= 1_000_000) {
    return `AED ${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }

  return `AED ${Math.round(value).toLocaleString()}`;
}

function buildSpecialtyCards(
  featuredAreas: string[],
  listings: Property[],
): Array<{ eyebrow: string; title: string; image: ResolvedImage | null }> {
  const fallbackAreas = ['Dubai Marina', 'Palm Jumeirah', 'Downtown Dubai'];
  const headings = ['Waterfront Living', 'Exclusive Luxury', 'Metropolitan Life'];
  const areaPool = featuredAreas.length > 0
    ? featuredAreas
    : [
      ...new Set(
        listings
          .map((listing) => extractArea(listing.location))
          .filter((value): value is string => Boolean(value)),
      ),
      ...fallbackAreas,
    ];

  return areaPool.slice(0, 3).map((title, index) => {
    const matchedListing =
      listings.find((listing) => listing.location.toLowerCase().includes(title.toLowerCase())) ||
      listings[index] ||
      listings[0];

    return {
      eyebrow: headings[index] || 'Prime Address',
      title,
      image: matchedListing ? resolveImage(matchedListing.images[0], 'prop-1-1', `${title} real estate`) : null,
    };
  });
}

export async function AgentProfilePageContent({
  agentSlug,
  agencySlug,
}: {
  agentSlug: string;
  agencySlug?: string | null;
}) {
  const [profileResponse, siteConfig, organizationListings] = await Promise.all([
    getAgentProfile(agentSlug, agencySlug),
    getSiteConfigOrNull(agencySlug),
    getProperties({ limit: 8 }, agencySlug),
  ]);

  if (!profileResponse?.agent) {
    notFound();
  }

  const { organization, profile, agent, stats, activeListings } = profileResponse;
  const displayName = organization.name || 'Agency Website';
  const avatar = resolveImage(
    agent.avatar || agent.avatarUrl || 'founder-photo',
    'founder-photo',
    `${agent.name} portrait`,
  );
  const coverSource = agent.coverImage || agent.coverImageUrl || siteConfig?.branding?.coverImage || null;
  const coverImage = coverSource
    ? resolveImage(coverSource, 'prop-1-1', `${agent.name} cover image`)
    : null;
  const headline = agent.title || agent.tagline || 'Property Consultant';
  const summary = getSummary(agent.bio, agent.tagline, profile?.aboutCompany, agent.name, displayName);
  const biography = buildBiography(summary, profile?.aboutCompany, getQuickFact(profile?.officeAddress));
  const whatsappHref =
    toSocialUrl('whatsapp', agent.whatsapp || agent.phone || profile?.contact?.whatsappNumber) || null;
  const email = agent.email || profile?.contact?.officialEmail || null;
  const phoneHref = agent.phone ? `tel:${agent.phone}` : null;
  const officePhone = profile?.contact?.primaryPhone || null;
  const reviewCountLabel = siteConfig?.stats?.testimonials
    ? `${siteConfig.stats.testimonials}+ Reviews`
    : `${Math.max(agent.totalDeals || 0, 120)}+ Reviews`;
  const organizationListingPool = organizationListings.properties.filter(
    (listing) => !activeListings.some((active) => active.id === listing.id),
  );
  const featuredListings = [...activeListings, ...organizationListingPool].slice(0, 4);
  const reviewCards = normalizeBrokerReviewCards(agent.reviewSources);
  const specialtyCards = buildSpecialtyCards(siteConfig?.featuredAreas || [], featuredListings);
  const statCards = [
    {
      value: `${agent.yearsExperience || 0}+`,
      label: 'Years',
    },
    {
      value: `${agent.totalDeals || stats.soldListings + stats.rentedListings || 0}+`,
      label: 'Deals',
    },
    {
      value: formatCompactPortfolio(featuredListings.reduce((sum, listing) => sum + (listing.price || 0), 0)),
      label: 'Sales',
    },
  ];

  return (
    <AgentProfileExperience
      agencySlug={agencySlug}
      agentName={agent.name}
      headline={headline}
      displayName={displayName}
      brn={agent.brn || agent.licenseNumber || null}
      avatar={avatar}
      coverImage={coverImage}
      biography={biography}
      reviewCountLabel={reviewCountLabel}
      whatsappHref={whatsappHref}
      phoneHref={phoneHref}
      email={email}
      officePhone={officePhone}
      featuredListings={featuredListings}
      reviewCards={reviewCards}
      specialtyCards={specialtyCards}
      statCards={statCards}
    />
  );
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ agentSlug: string }>;
}) {
  const { agentSlug } = await params;
  return <AgentProfilePageContent agentSlug={agentSlug} />;
}
