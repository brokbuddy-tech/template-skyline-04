import { PropertyMapExplorer } from '@/components/shared/property-map-explorer';
import { getProperties, getSiteConfig } from '@/lib/api';

export default async function MapPage() {
  const [siteConfig, propertiesResponse] = await Promise.all([
    getSiteConfig(),
    getProperties({ limit: '200' }),
  ]);

  const displayName =
    siteConfig.branding?.displayName
    || siteConfig.organization.name
    || 'SkyLines';

  return (
    <div className="container mx-auto px-4 py-20 sm:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Zero-cost map search
        </p>
        <h1 className="mt-4 text-5xl font-headline font-medium sm:text-6xl">
          Explore {displayName} listings on OpenStreetMap
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every map pin is rendered from the latitude and longitude saved on the listing itself, powered by
          OpenStreetMap tiles and Leaflet on the customer side.
        </p>
      </div>

      <div className="mt-12">
        <PropertyMapExplorer properties={propertiesResponse.properties} />
      </div>
    </div>
  );
}
