import { AgentsDirectoryClient } from '@/components/shared/agents-directory-client';
import { getAgents, getSiteConfig } from '@/lib/api';

export async function AgentsPageContent({ agencySlug }: { agencySlug?: string | null }) {
  const [siteConfig, agentsResponse] = await Promise.all([
    getSiteConfig(agencySlug),
    getAgents(agencySlug),
  ]);

  const agencyName =
    siteConfig.branding?.displayName
    || siteConfig.organization.name
    || agentsResponse.organization.name
    || 'Agency Website';
  const introCopy =
    siteConfig.profile?.aboutCompany
    || siteConfig.branding?.bio
    || `Meet the active brokers representing ${agencyName}. Every profile and listing count on this page is pulled from the organization workspace in Broker OS.`;

  return (
    <div className="bg-background">
      <section className="border-b border-border/70 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.14),transparent_36%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--muted)/0.35)_100%)] px-6 py-20 sm:px-8">
        <div className="container mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Agents
          </p>
          <h1 className="mt-5 text-5xl font-headline font-semibold text-foreground sm:text-6xl">
            The people clients meet first at {agencyName}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {introCopy}
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8">
        <div className="container mx-auto">
          <AgentsDirectoryClient
            agencyName={agencyName}
            agencySlug={agencySlug}
            agents={agentsResponse.agents}
          />
        </div>
      </section>
    </div>
  );
}

export default async function AgentsPage() {
  return <AgentsPageContent />;
}
