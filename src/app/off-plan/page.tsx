import { OffPlanPageClient } from '@/components/shared/off-plan-page-client';
import { getProperties, getSiteConfig } from '@/lib/api';
import { properties as fallbackProperties } from '@/lib/data';

export default async function OffPlanPage() {
  const [siteConfig, propertiesResponse] = await Promise.all([
    getSiteConfig(),
    getProperties({ limit: 200 }),
  ]);

  const properties = propertiesResponse.properties.length > 0 ? propertiesResponse.properties : fallbackProperties;
  const offPlanProperties = properties.filter(property => property.status === 'Off-plan');

  return <OffPlanPageClient properties={offPlanProperties} categories={siteConfig.categories} />;
}
