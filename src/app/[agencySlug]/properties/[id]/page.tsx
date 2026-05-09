import { PropertyDetailPageContent } from '../../../properties/[id]/page';

export default async function AgencyPropertyDetailPage({
  params,
}: {
  params: Promise<{ agencySlug: string; id: string }>;
}) {
  const { agencySlug, id } = await params;
  return <PropertyDetailPageContent agencySlug={agencySlug} id={id} />;
}
