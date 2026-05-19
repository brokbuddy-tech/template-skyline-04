'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, MessageSquare, Phone, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SocialIcons } from '@/components/shared/social-icons';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { resolveImage } from '@/lib/property-media';
import { toSocialUrl } from '@/lib/api';
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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAgents.map((agent) => {
            const avatar = resolveImage(agent.avatar || 'founder-photo', 'founder-photo', `${agent.name} portrait`);
            const phoneHref = agent.phone ? `tel:${agent.phone}` : null;
            const whatsappHref = toSocialUrl('whatsapp', agent.whatsapp || agent.phone);
            const emailHref = agent.email ? `mailto:${agent.email}` : null;
            const profileHref = agent.slug ? prefixAgencyPath(`/agents/${agent.slug}`, agencySlug) : null;

            return (
              <Card key={agent.id || agent.slug || agent.name} className="overflow-hidden rounded-[28px] border border-border bg-background shadow-sm">
                <div className="relative z-0 h-36 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.18),transparent_42%),linear-gradient(135deg,hsl(var(--primary))_0%,hsl(var(--accent))_100%)]" />
                <div className="relative z-10 px-6 pb-6">
                  <div className="relative z-10 -mt-14 flex items-end gap-4">
                    <div className="relative z-10 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border-4 border-background bg-muted shadow-md">
                      {avatar ? (
                        <Image
                          src={avatar.src}
                          alt={agent.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover object-top"
                          data-ai-hint={avatar.hint}
                          unoptimized={avatar.unoptimized}
                        />
                      ) : (
                        <span className="text-2xl font-semibold text-muted-foreground">
                          {agent.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="pb-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        {agent.totalListings || 0} listings
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <h3 className="text-2xl font-headline font-semibold text-foreground">{agent.name}</h3>
                      <p className="mt-1 text-sm font-medium text-accent">
                        {agent.title || agent.tagline || 'Property Consultant'}
                      </p>
                    </div>

                    {agent.bio ? (
                      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {agent.bio}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      {(agent.languages || []).slice(0, 3).map((language) => (
                        <Badge key={`${agent.name}-${language}`} variant="outline" className="rounded-full">
                          {language}
                        </Badge>
                      ))}
                      {(agent.specializations || []).slice(0, 2).map((specialization) => (
                        <Badge key={`${agent.name}-${specialization}`} className="rounded-full bg-accent/10 text-accent hover:bg-accent/10">
                          {specialization}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid gap-2 text-sm text-muted-foreground">
                      {agent.phone ? <p><span className="font-semibold text-foreground">Phone:</span> {agent.phone}</p> : null}
                      {agent.email ? <p><span className="font-semibold text-foreground">Email:</span> {agent.email}</p> : null}
                    </div>

                    <SocialIcons
                      links={{
                        instagram: agent.instagram,
                        linkedin: agent.linkedin,
                        twitter: agent.twitter
                      }}
                    />

                    <div className="flex flex-wrap gap-3">
                      {profileHref ? (
                        <Button asChild className="rounded-full">
                          <Link href={profileHref}>
                            View Profile
                          </Link>
                        </Button>
                      ) : null}
                      {phoneHref ? (
                        <Button asChild variant="outline" className="rounded-full">
                          <a href={phoneHref}>
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </a>
                        </Button>
                      ) : null}
                      {whatsappHref ? (
                        <Button asChild variant="outline" className="rounded-full">
                          <a href={whatsappHref} target="_blank" rel="noreferrer">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            WhatsApp
                          </a>
                        </Button>
                      ) : emailHref ? (
                        <Button asChild variant="outline" className="rounded-full">
                          <a href={emailHref}>
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
