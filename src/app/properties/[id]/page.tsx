
import { notFound } from 'next/navigation';
import { PropertyDetailPageClient } from '@/components/shared/property-detail-page-client';
import { getProperties, getPropertyById, getSiteConfig } from '@/lib/api';
import { properties as fallbackProperties } from '@/lib/data';

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, allPropertiesResponse, siteConfig] = await Promise.all([
    getPropertyById(id),
    getProperties({ limit: 200 }),
    getSiteConfig(),
  ]);

  const resolvedProperty = property || fallbackProperties.find(item => item.id === id) || null;
  if (!resolvedProperty) {
    notFound();
  }

  const allProperties = allPropertiesResponse.properties.length > 0 ? allPropertiesResponse.properties : fallbackProperties;
  const recommendedProperties = allProperties.filter(item => item.id !== resolvedProperty.id).slice(0, 2);
  const fallbackAgent = siteConfig.leadAgent
    ? {
        name: siteConfig.leadAgent.name,
        title: siteConfig.leadAgent.tagline || undefined,
        avatarUrl: siteConfig.leadAgent.avatar || undefined,
        phone: siteConfig.leadAgent.phone || undefined,
        email: siteConfig.leadAgent.email || undefined,
        whatsapp: siteConfig.leadAgent.whatsapp || undefined,
        company: siteConfig.organization.name,
        licenseNumber: siteConfig.leadAgent.licenseNumber || undefined,
        slug: siteConfig.leadAgent.slug || undefined,
        instagram: siteConfig.leadAgent.instagram || undefined,
        linkedin: siteConfig.leadAgent.linkedin || undefined,
        twitter: siteConfig.leadAgent.twitter || undefined,
      }
    : undefined;

  return (
    <PropertyDetailPageClient
      property={resolvedProperty}
      recommendedProperties={recommendedProperties}
      fallbackAgent={fallbackAgent}
    />
  );
}
