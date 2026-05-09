import { MapPageContent } from '../../map/page';

export default async function AgencyMapPage({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;
  return <MapPageContent agencySlug={agencySlug} />;
}
