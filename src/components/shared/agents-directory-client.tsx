'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { resolveImage } from '@/lib/property-media';
import type { SiteAgent } from '@/lib/types';

function matchAgent(agent: SiteAgent, query: string) {
  const searchable = [
    agent.name,
    agent.title,
    agent.tagline,
    agent.bio,
    ...(agent.languages || []),
    ...(agent.specializations || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchable.includes(query.toLowerCase());
}

export function AgentsDirectoryClient({
  agencyName,
  agencySlug,
  agents,
}: {
  agencyName: string;
  agencySlug?: string | null;
  agents: SiteAgent[];
}) {
  const [query, setQuery] = useState('');

  const filteredAgents = useMemo(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return agents;
    }

    return agents.filter((agent) => matchAgent(agent, normalizedQuery));
  }, [agents, query]);

  return (
    <div className="space-y-10">
      <div className="rounded-[28px] border border-border bg-background/90 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Public agents directory
            </p>
            <h2 className="mt-3 text-3xl font-headline font-semibold text-foreground sm:text-4xl">
              Meet the brokers behind {agencyName}
            </h2>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, language, or specialty"
              className="h-12 rounded-full pl-11"
            />
          </div>
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <Card className="rounded-[28px] border-dashed p-10 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-accent" />
          <h3 className="mt-4 text-xl font-semibold">No agents matched that search</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader search like a first name, a language, or a specialty area.
          </p>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredAgents.map((agent) => {
            const avatar = resolveImage(agent.avatar || 'founder-photo', 'founder-photo', `${agent.name} portrait`);
            const phoneHref = agent.phone ? `tel:${agent.phone}` : null;
            const emailHref = agent.email ? `mailto:${agent.email}` : null;
            const profileHref = agent.slug ? prefixAgencyPath(`/agents/${agent.slug}`, agencySlug) : null;

            return (
              <Card key={agent.id || agent.slug || agent.name} className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                <div className="relative aspect-[4/3] bg-muted">
                  {avatar ? (
                    <Image
                      src={avatar.src}
                      alt={agent.name}
                      fill
                      className="object-cover object-top"
                      data-ai-hint={avatar.hint}
                      unoptimized={avatar.unoptimized}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-5xl font-semibold text-muted-foreground">
                      {agent.name.charAt(0)}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
                </div>

                <div className="flex min-h-[276px] flex-1 flex-col gap-4 p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                      {agent.title || agent.tagline || 'Property Consultant'}
                    </p>
                    <h3 className="mt-2 text-2xl font-headline font-semibold text-foreground">{agent.name}</h3>
                    {agent.bio ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {agent.bio}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    {emailHref ? (
                      <a href={emailHref} className="flex items-center gap-2 break-all hover:text-accent">
                        <Mail className="h-4 w-4 text-accent" />
                        {agent.email}
                      </a>
                    ) : null}
                    {phoneHref ? (
                      <a href={phoneHref} className="flex items-center gap-2 hover:text-accent">
                        <Phone className="h-4 w-4 text-accent" />
                        {agent.phone}
                      </a>
                    ) : null}
                  </div>

                  {profileHref ? (
                    <Link
                      href={profileHref}
                      className="mt-auto inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-accent"
                    >
                      View Profile
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
