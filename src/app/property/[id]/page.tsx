import { PropertyDetailPageContent } from '../../properties/[id]/page';

type PropertyDetailAliasPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyDetailAliasPage({ params }: PropertyDetailAliasPageProps) {
  const { id } = await params;
  return <PropertyDetailPageContent id={id} />;
}
