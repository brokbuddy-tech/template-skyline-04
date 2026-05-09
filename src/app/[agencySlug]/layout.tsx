import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/api';
import { buildAgencyThemeStyle } from '@/lib/agency-theme';

type AgencyLayoutParams = Promise<{ agencySlug: string }>;

async function loadAgencySiteConfig(params: AgencyLayoutParams) {
  const { agencySlug } = await params;
  const siteConfig = await getSiteConfig(agencySlug);

  return { agencySlug, siteConfig };
}

export async function generateMetadata({
  params,
}: {
  params: AgencyLayoutParams;
}): Promise<Metadata> {
  const { siteConfig } = await loadAgencySiteConfig(params);
  const displayName =
    siteConfig.branding?.displayName || siteConfig.organization.name || 'Agency Website';
  const description =
    siteConfig.profile?.aboutCompany
    || siteConfig.branding?.bio
    || siteConfig.branding?.tagline
    || `Explore the public website for ${displayName}.`;

  return {
    title: {
      default: displayName,
      template: `%s | ${displayName}`,
    },
    description,
    openGraph: {
      title: displayName,
      description,
      url: siteConfig.organization.publicAgencyUrl || undefined,
      siteName: displayName,
      images: siteConfig.profile?.logo ? [{ url: siteConfig.profile.logo }] : undefined,
    },
  };
}

export default async function AgencyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: AgencyLayoutParams;
}) {
  const { siteConfig } = await loadAgencySiteConfig(params);

  return (
    <div style={buildAgencyThemeStyle(siteConfig.profile)}>
      {children}
    </div>
  );
}
