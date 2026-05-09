import { OffPlanPageContent } from '../../off-plan/page';

export default async function AgencyOffPlanPage({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;
  return <OffPlanPageContent agencySlug={agencySlug} />;
}
