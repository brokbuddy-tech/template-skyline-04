
import { PropertiesPageClient } from '@/components/shared/properties-page-client';
import { getProperties, getSiteConfig } from '@/lib/api';
import { filterProperties, getFiltersFromSearchParams } from '@/lib/search';

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const [siteConfig, propertiesResponse] = await Promise.all([
    getSiteConfig(),
    getProperties({ limit: 200 }),
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
