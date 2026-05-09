
import { PropertiesPageClient } from '@/components/shared/properties-page-client';
import { getProperties, getSiteConfig } from '@/lib/api';
import { filterProperties, getFiltersFromSearchParams } from '@/lib/search';

type PropertiesPageSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function PropertiesPageContent({
  searchParams,
  agencySlug,
}: {
  searchParams: PropertiesPageSearchParams;
  agencySlug?: string | null;
}) {
  const resolvedSearchParams = await searchParams;
  const [siteConfig, propertiesResponse] = await Promise.all([
    getSiteConfig(agencySlug),
    getProperties({ limit: 200 }, agencySlug),
  ]);

  const allProperties = propertiesResponse.properties.length > 0 ? propertiesResponse.properties : [];
  const filteredProperties = filterProperties(allProperties, getFiltersFromSearchParams(resolvedSearchParams));
  const pageType = Array.isArray(resolvedSearchParams.type) ? resolvedSearchParams.type[0] : resolvedSearchParams.type;
  const title =
    pageType === 'rent'
      ? 'Properties for Rent'
      : pageType === 'buy'
        ? 'Properties for Sale'
        : 'Our Properties';

  return (
    <PropertiesPageClient
      title={title}
      properties={filteredProperties}
      categories={siteConfig.categories}
      amenities={siteConfig.amenities}
    />
  );
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: PropertiesPageSearchParams;
}) {
  return <PropertiesPageContent searchParams={searchParams} />;
}
