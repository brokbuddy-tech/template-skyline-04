import { PropertyDetailPageContent } from '../../../properties/[id]/page';

type AgencyPropertyDetailAliasPageProps = {
  params: Promise<{
    agencySlug: string;
    id: string;
  }>;
};

export default async function AgencyPropertyDetailAliasPage({
  params,
}: AgencyPropertyDetailAliasPageProps) {
  const { agencySlug, id } = await params;
  return <PropertyDetailPageContent id={id} agencySlug={agencySlug} />;
}
