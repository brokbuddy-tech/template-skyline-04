import { AgentsPageContent } from '../../agents/page';

export default async function AgencyAgentsPage({
  params,
}: {
  params: Promise<{ agencySlug: string }>;
}) {
  const { agencySlug } = await params;
  return <AgentsPageContent agencySlug={agencySlug} />;
}
