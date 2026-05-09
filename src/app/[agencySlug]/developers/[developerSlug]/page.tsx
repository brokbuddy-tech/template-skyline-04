import { DeveloperDetailPageContent } from '../../../developers/[developerSlug]/page';

export default async function AgencyDeveloperDetailPage({
  params,
}: {
  params: Promise<{ agencySlug: string; developerSlug: string }>;
}) {
  const { agencySlug, developerSlug } = await params;
  return (
    <DeveloperDetailPageContent
      agencySlug={agencySlug}
      developerSlug={developerSlug}
    />
  );
}
