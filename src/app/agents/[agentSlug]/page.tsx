import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BriefcaseBusiness, Globe, Languages, Mail, MessageSquare, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PropertyCard } from '@/components/shared/property-card';
import { SocialIcons } from '@/components/shared/social-icons';
import { getAgentProfile, toSocialUrl } from '@/lib/api';
import { resolveImage } from '@/lib/property-media';
import { prefixAgencyPath } from '@/lib/agency-routing';

export async function AgentProfilePageContent({
  agentSlug,
  agencySlug,
}: {
  agentSlug: string;
  agencySlug?: string | null;
}) {
  const profileResponse = await getAgentProfile(agentSlug, agencySlug);

  if (!profileResponse?.agent) {
    notFound();
  }

  const { organization, profile, agent, stats, activeListings, soldListings, rentedListings } = profileResponse;
  const displayName = organization.name || 'Agency Website';
  const accentColor = agent.primaryColor || profile?.primaryColor || '#1E88E5';
  const avatar = resolveImage(agent.avatar || 'founder-photo', 'founder-photo', `${agent.name} portrait`);
  const whatsappHref =
    toSocialUrl('whatsapp', agent.whatsapp || agent.phone || profile?.contact?.whatsappNumber) || null;
  const emailHref = agent.email ? `mailto:${agent.email}` : null;
  const phoneHref = agent.phone ? `tel:${agent.phone}` : null;
  const officeEmail = profile?.contact?.officialEmail || null;
  const officePhone = profile?.contact?.primaryPhone || null;

  return (
    <div className="bg-background">
      <section className="border-b border-border/70 px-6 py-16 sm:px-8" style={{ background: `radial-gradient(circle at top right, ${accentColor}22, transparent 34%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted) / 0.45) 100%)` }}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href={prefixAgencyPath('/', agencySlug)} className="hover:text-foreground">Home</Link>
            <ArrowRight className="h-4 w-4" />
            <Link href={prefixAgencyPath('/agents', agencySlug)} className="hover:text-foreground">Agents</Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-foreground">{agent.name}</span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="space-y-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[32px] border border-border bg-background shadow-md">
                  {avatar ? (
                    <Image
                      src={avatar.src}
                      alt={agent.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                      data-ai-hint={avatar.hint}
                      unoptimized={avatar.unoptimized}
                    />
                  ) : (
                    <span className="text-4xl font-semibold text-muted-foreground">{agent.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <Badge className="rounded-full bg-accent/10 text-accent hover:bg-accent/10">
                    {displayName}
                  </Badge>
                  <h1 className="mt-4 text-4xl font-headline font-semibold text-foreground sm:text-5xl">
                    {agent.name}
                  </h1>
                  <p className="mt-3 text-lg font-medium" style={{ color: accentColor }}>
                    {agent.title || agent.tagline || 'Property Consultant'}
                  </p>
                  {agent.bio ? (
                    <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
                      {agent.bio}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {phoneHref ? (
                  <Button asChild className="rounded-full">
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
                ) : null}
                {emailHref ? (
                  <Button asChild variant="outline" className="rounded-full">
                    <a href={emailHref}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                ) : null}
                <Button asChild variant="ghost" className="rounded-full">
                  <Link href={prefixAgencyPath('/contact', agencySlug)}>
                    Contact {displayName}
                  </Link>
                </Button>
              </div>

              <SocialIcons
                links={{
                  instagram: agent.instagram,
                  linkedin: agent.linkedin,
                  twitter: agent.twitter,
                  whatsapp: agent.whatsapp || agent.phone,
                }}
              />
            </div>

            <Card className="rounded-[28px] border border-border bg-background p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Profile snapshot</h2>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {[
                  { label: 'Active listings', value: stats.activeListings },
                  { label: 'Sold properties', value: stats.soldListings },
                  { label: 'Rented properties', value: stats.rentedListings },
                  { label: 'Years experience', value: agent.yearsExperience || 0 },
                  { label: 'Deals closed', value: agent.totalDeals || 0 },
                  { label: 'Languages', value: (agent.languages || []).length },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border bg-muted/35 p-4">
                    <p className="text-2xl font-headline font-semibold text-foreground">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-10">
            {(agent.specializations?.length || agent.languages?.length) ? (
              <Card className="rounded-[28px] border border-border p-6 shadow-sm">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <BriefcaseBusiness className="h-4 w-4 text-accent" />
                      <h2 className="text-lg font-semibold">Specializations</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(agent.specializations || []).map((specialization) => (
                        <Badge key={specialization} variant="outline" className="rounded-full">
                          {specialization}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <Languages className="h-4 w-4 text-accent" />
                      <h2 className="text-lg font-semibold">Languages</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(agent.languages || []).map((language) => (
                        <Badge key={language} className="rounded-full bg-accent/10 text-accent hover:bg-accent/10">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ) : null}

            <div>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Active portfolio
                  </p>
                  <h2 className="mt-2 text-3xl font-headline font-semibold text-foreground">
                    Live listings from {agent.name}
                  </h2>
                </div>
              </div>
              {activeListings.length > 0 ? (
                <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
                  {activeListings.map((listing) => (
                    <PropertyCard key={listing.id} property={listing} />
                  ))}
                </div>
              ) : (
                <Card className="rounded-[28px] border-dashed p-8 text-center text-muted-foreground">
                  No active listings are public for this agent yet.
                </Card>
              )}
            </div>

            {(soldListings.length > 0 || rentedListings.length > 0) ? (
              <>
                <Separator />
                <div className="grid gap-6 xl:grid-cols-2">
                  <Card className="rounded-[28px] border border-border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-foreground">Sold properties</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Recently completed sales attributed to this agent within {displayName}.
                    </p>
                    <div className="mt-5 space-y-4">
                      {soldListings.slice(0, 3).map((listing) => (
                        <div key={listing.id} className="rounded-2xl border border-border bg-muted/35 p-4">
                          <p className="font-semibold text-foreground">{listing.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{listing.location}</p>
                        </div>
                      ))}
                      {soldListings.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No public sold properties yet.</p>
                      ) : null}
                    </div>
                  </Card>

                  <Card className="rounded-[28px] border border-border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-foreground">Rented properties</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Public rental deals completed by this agent for the organization.
                    </p>
                    <div className="mt-5 space-y-4">
                      {rentedListings.slice(0, 3).map((listing) => (
                        <div key={listing.id} className="rounded-2xl border border-border bg-muted/35 p-4">
                          <p className="font-semibold text-foreground">{listing.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{listing.location}</p>
                        </div>
                      ))}
                      {rentedListings.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No public rented properties yet.</p>
                      ) : null}
                    </div>
                  </Card>
                </div>
              </>
            ) : null}
          </div>

          <div className="space-y-6">
            <Card className="rounded-[28px] border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">Agency information</h2>
              </div>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p><span className="font-semibold text-foreground">Agency:</span> {displayName}</p>
                {profile?.officeAddress ? <p><span className="font-semibold text-foreground">Office:</span> {profile.officeAddress}</p> : null}
                {profile?.officeTimings ? <p><span className="font-semibold text-foreground">Hours:</span> {profile.officeTimings}</p> : null}
                {officeEmail ? <p><span className="font-semibold text-foreground">Email:</span> {officeEmail}</p> : null}
                {officePhone ? <p><span className="font-semibold text-foreground">Phone:</span> {officePhone}</p> : null}
              </div>
              {profile?.aboutCompany ? (
                <p className="mt-5 text-sm leading-6 text-muted-foreground">
                  {profile.aboutCompany}
                </p>
              ) : null}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ agentSlug: string }>;
}) {
  const { agentSlug } = await params;
  return <AgentProfilePageContent agentSlug={agentSlug} />;
}
