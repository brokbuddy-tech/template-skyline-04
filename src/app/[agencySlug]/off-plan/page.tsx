import { OffPlanPageContent } from '@/components/shared/off-plan-page-content';

export default async function AgencyOffPlanPage({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;
  return <OffPlanPageContent agencySlug={agencySlug} />;
}
