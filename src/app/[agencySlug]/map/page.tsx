import { MapPageContent } from '@/components/shared/map-page-content';

export default async function AgencyMapPage({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;
  return <MapPageContent agencySlug={agencySlug} />;
}
