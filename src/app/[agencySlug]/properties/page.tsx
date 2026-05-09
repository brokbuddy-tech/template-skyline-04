import { PropertiesPageContent } from '../../properties/page';

export default async function AgencyPropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ agencySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { agencySlug } = await params;
  return <PropertiesPageContent agencySlug={agencySlug} searchParams={searchParams} />;
}
