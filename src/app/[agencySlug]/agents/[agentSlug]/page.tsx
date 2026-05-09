import type { Metadata } from 'next';
import { AgentProfilePageContent } from '../../../agents/[agentSlug]/page';
import { getAgentProfile } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agencySlug: string; agentSlug: string }>;
}): Promise<Metadata> {
  const { agencySlug, agentSlug } = await params;
  const profile = await getAgentProfile(agentSlug, agencySlug);

  if (!profile?.agent) {
    return {};
  }

  const agencyName = profile.organization.name || 'Agency Website';
  const title =
    profile.agent.metaTitle
    || `${profile.agent.name} | ${agencyName}`;
  const description =
    profile.agent.metaDescription
    || profile.agent.bio
    || profile.profile?.aboutCompany
    || `Connect with ${profile.agent.name} at ${agencyName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${profile.organization.publicAgencyUrl || ''}/agents/${profile.agent.slug || agentSlug}`,
      images: profile.agent.avatar ? [{ url: profile.agent.avatar }] : undefined,
    },
  };
}

export default async function AgencyAgentProfilePage({
  params,
}: {
  params: Promise<{ agencySlug: string; agentSlug: string }>;
}) {
  const { agencySlug, agentSlug } = await params;
  return <AgentProfilePageContent agencySlug={agencySlug} agentSlug={agentSlug} />;
}
