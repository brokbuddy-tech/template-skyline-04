import { DevelopersPageContent } from '@/components/shared/developers-page-content';

export default async function AgencyDevelopersPage({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;
  return <DevelopersPageContent agencySlug={agencySlug} />;
}
