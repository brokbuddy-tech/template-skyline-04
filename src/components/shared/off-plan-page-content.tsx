import { OffPlanPageClient } from '@/components/shared/off-plan-page-client';
import { getProperties, getSiteConfig } from '@/lib/api';

export async function OffPlanPageContent({ agencySlug }: { agencySlug?: string | null }) {
  const [siteConfig, propertiesResponse] = await Promise.all([
    getSiteConfig(agencySlug),
    getProperties({ limit: 200 }, agencySlug),
  ]);

  const properties = propertiesResponse.properties.length > 0 ? propertiesResponse.properties : [];
  const offPlanProperties = properties.filter(property => property.status === 'Off-plan');

  return <OffPlanPageClient properties={offPlanProperties} categories={siteConfig.categories} />;
}

