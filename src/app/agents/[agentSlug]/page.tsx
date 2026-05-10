import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  Globe,
  Languages,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PropertyCard } from '@/components/shared/property-card';
import { SocialIcons } from '@/components/shared/social-icons';
import { getAgentProfile, toSocialUrl } from '@/lib/api';
import { resolveImage } from '@/lib/property-media';
import { prefixAgencyPath } from '@/lib/agency-routing';

function getFirstName(name: string) {
  return name.trim().split(' ')[0] || name;
}

function getSummary(
  agentBio?: string | null,
  agentTagline?: string | null,
  aboutCompany?: string | null,
  agentName?: string,
  agencyName?: string,
) {
  return (
    agentBio
    || agentTagline
    || aboutCompany
    || `Connect with ${agentName || 'this agent'} at ${agencyName || 'the organization'} for tailored property guidance.`
  );
}

function getQuickFact(value?: string | number | null) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  const trimmed = value.trim();
  return trimmed || null;
}

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
  const headline = agent.title || agent.tagline || 'Property Consultant';
  const summary = getSummary(agent.bio, agent.tagline, profile?.aboutCompany, agent.name, displayName);
  const firstName = getFirstName(agent.name);
  const specializations = (agent.specializations || []).filter(Boolean);
  const languages = (agent.languages || []).filter(Boolean);
  const whatsappHref =
    toSocialUrl('whatsapp', agent.whatsapp || agent.phone || profile?.contact?.whatsappNumber) || null;
  const emailHref = agent.email ? `mailto:${agent.email}` : null;
  const phoneHref = agent.phone ? `tel:${agent.phone}` : null;
  const officeEmail = profile?.contact?.officialEmail || null;
  const officePhone = profile?.contact?.primaryPhone || null;
  const officeAddress = getQuickFact(profile?.officeAddress);
  const officeTimings = getQuickFact(profile?.officeTimings);
  const websiteHref = toSocialUrl('website', agent.website);
  const heroHighlights = [
    { icon: Trophy, label: 'Years in market', value: `${agent.yearsExperience || 0}+` },
    { icon: BriefcaseBusiness, label: 'Deals closed', value: `${agent.totalDeals || 0}` },
    { icon: Building2, label: 'Active listings', value: `${stats.activeListings}` },
    { icon: Languages, label: 'Languages', value: `${languages.length || 0}` },
  ];
  const snapshotItems = [
    { label: 'Active listings', value: stats.activeListings },
    { label: 'Sold properties', value: stats.soldListings },
    { label: 'Rented properties', value: stats.rentedListings },
    { label: 'Years experience', value: agent.yearsExperience || 0 },
    { label: 'Deals closed', value: agent.totalDeals || 0 },
    { label: 'Languages', value: languages.length || 0 },
  ];

  return (
    <div className="bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_24%,#f8f8fc_100%)]">
      <section className="relative overflow-hidden px-6 pb-12 pt-16 sm:px-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[440px]"
          style={{
            background: `radial-gradient(circle at 15% 15%, ${accentColor}18, transparent 26%), radial-gradient(circle at 88% 0%, ${accentColor}22, transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.55))`,
          }}
        />

        <div className="container relative mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href={prefixAgencyPath('/', agencySlug)} className="hover:text-foreground">Home</Link>
            <ArrowRight className="h-4 w-4" />
            <Link href={prefixAgencyPath('/agents', agencySlug)} className="hover:text-foreground">Agents</Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-foreground">{agent.name}</span>
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_360px] xl:items-start">
            <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/85 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
              <div
                className="absolute inset-x-0 top-0 h-44"
                style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #0F172A 100%)` }}
              />
              <div className="absolute left-[-40px] top-8 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute right-[-32px] top-[-24px] h-36 w-36 rounded-full bg-white/10" />

              <div className="relative px-8 pb-8 pt-8 sm:px-10 sm:pb-10">
                <Badge className="rounded-full border border-white/20 bg-white/14 px-4 py-1 text-white hover:bg-white/14">
                  {displayName}
                </Badge>

                <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 scale-105 rounded-[34px] bg-white/20 blur-xl" />
                    <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-[34px] border-[6px] border-white/90 bg-white shadow-xl">
                      {avatar ? (
                        <Image
                          src={avatar.src}
                          alt={agent.name}
                          width={144}
                          height={144}
                          className="h-full w-full object-cover object-top"
                          data-ai-hint={avatar.hint}
                          unoptimized={avatar.unoptimized}
                        />
                      ) : (
                        <span className="text-5xl font-semibold text-muted-foreground">{agent.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                      Particular Agent Page
                    </p>
                    <h1 className="mt-3 text-4xl font-headline font-semibold tracking-tight text-white sm:text-5xl">
                      {agent.name}
                    </h1>
                    <p className="mt-3 text-lg font-medium text-white/88">{headline}</p>
                    <p className="mt-5 max-w-3xl text-base leading-7 text-white/74 sm:text-lg">{summary}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {specializations.slice(0, 3).map((specialization) => (
                        <Badge
                          key={specialization}
                          variant="outline"
                          className="rounded-full border-white/18 bg-white/10 px-4 py-1.5 text-white hover:bg-white/10"
                        >
                          {specialization}
                        </Badge>
                      ))}
                      {languages.slice(0, 2).map((language) => (
                        <Badge key={language} className="rounded-full bg-white text-slate-900 hover:bg-white">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {phoneHref ? (
                    <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-white/90">
                      <a href={phoneHref}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call {firstName}
                      </a>
                    </Button>
                  ) : null}
                  {whatsappHref ? (
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/18 hover:text-white"
                    >
                      <a href={whatsappHref} target="_blank" rel="noreferrer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                  ) : null}
                  {emailHref ? (
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/18 hover:text-white"
                    >
                      <a href={emailHref}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </a>
                    </Button>
                  ) : null}
                  <Button
                    asChild
                    variant="ghost"
                    className="rounded-full text-white hover:bg-white/12 hover:text-white"
                  >
                    <Link href={prefixAgencyPath('/contact', agencySlug)}>
                      Contact {displayName}
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  {heroHighlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[24px] border border-slate-200/80 bg-white p-4 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          {item.label}
                        </p>
                        <item.icon className="h-4 w-4 text-[#1E88E5]" />
                      </div>
                      <p className="mt-4 text-2xl font-headline font-semibold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 xl:sticky xl:top-28">
              <Card className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(30,136,229,0.12)]">
                <div className="relative h-28 bg-[linear-gradient(135deg,#0F172A_0%,#1E88E5_100%)]">
                  <div className="absolute left-6 top-4 h-20 w-20 rounded-full bg-white/10" />
                  <div className="absolute -right-6 top-[-10px] h-24 w-24 rounded-full bg-white/10" />
                </div>

                <div className="relative px-6 pb-6 pt-0">
                  <div className="-mt-16 flex flex-col items-center text-center">
                    <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-white shadow-md">
                      {avatar ? (
                        <Image
                          src={avatar.src}
                          alt={agent.name}
                          width={112}
                          height={112}
                          className="h-full w-full object-cover object-top"
                          data-ai-hint={avatar.hint}
                          unoptimized={avatar.unoptimized}
                        />
                      ) : (
                        <span className="text-4xl font-semibold text-muted-foreground">{agent.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="mt-4 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <h2 className="mt-4 text-2xl font-headline font-semibold text-foreground">{agent.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{headline}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <Button size="lg" asChild className="h-12 rounded-[14px] shadow-[0_12px_30px_rgba(30,136,229,0.22)]">
                      <a href={phoneHref || prefixAgencyPath('/contact', agencySlug)}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call Agent
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="h-12 rounded-[14px] border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5]/5"
                    >
                      <a href={whatsappHref || prefixAgencyPath('/contact', agencySlug)} target={whatsappHref ? '_blank' : undefined} rel="noreferrer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                    {emailHref ? (
                      <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="h-12 rounded-[14px] border-slate-200 hover:bg-slate-50"
                      >
                        <a href={emailHref}>
                          <Mail className="mr-2 h-4 w-4" />
                          Email Agent
                        </a>
                      </Button>
                    ) : null}
                  </div>

                  <div className="mt-6 rounded-[24px] bg-[#F7FAFF] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Connect with {firstName.toUpperCase()}
                    </p>
                    <div className="-mx-2 mt-2">
                      <SocialIcons
                        links={{
                          instagram: agent.instagram,
                          linkedin: agent.linkedin,
                          twitter: agent.twitter,
                          whatsapp: agent.whatsapp || agent.phone,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-slate-100 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Agency support
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{displayName}</p>
                      {officePhone ? <p>{officePhone}</p> : null}
                      {officeEmail ? <p>{officeEmail}</p> : null}
                      {officeAddress ? <p>{officeAddress}</p> : null}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <h2 className="text-2xl font-headline font-semibold text-foreground">Profile snapshot</h2>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {snapshotItems.map((item) => (
                    <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-3xl font-headline font-semibold text-foreground">{item.value}</p>
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 sm:px-8">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="rounded-[32px] border border-white/70 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    About {firstName}
                  </p>
                  <h2 className="mt-3 text-3xl font-headline font-semibold text-foreground">
                    Property guidance with a clearer human touch
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{summary}</p>

                  {specializations.length > 0 ? (
                    <div className="mt-8">
                      <div className="mb-4 flex items-center gap-2">
                        <BriefcaseBusiness className="h-4 w-4 text-accent" />
                        <h3 className="text-lg font-semibold text-foreground">Specializations</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {specializations.map((specialization) => (
                          <Badge key={specialization} variant="outline" className="rounded-full px-4 py-1.5">
                            {specialization}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-[28px] bg-[#F7FAFF] p-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <h3 className="text-lg font-semibold text-foreground">At a glance</h3>
                  </div>

                  <div className="mt-5 space-y-4">
                    {(languages.length > 0 || officeAddress || officeTimings || websiteHref) ? (
                      <>
                        {languages.length > 0 ? (
                          <div className="flex items-start gap-3">
                            <Languages className="mt-0.5 h-4 w-4 text-accent" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Languages</p>
                              <p className="mt-1 text-sm text-muted-foreground">{languages.join(', ')}</p>
                            </div>
                          </div>
                        ) : null}
                        {officeAddress ? (
                          <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Office location</p>
                              <p className="mt-1 text-sm text-muted-foreground">{officeAddress}</p>
                            </div>
                          </div>
                        ) : null}
                        {officeTimings ? (
                          <div className="flex items-start gap-3">
                            <Clock3 className="mt-0.5 h-4 w-4 text-accent" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Office hours</p>
                              <p className="mt-1 text-sm text-muted-foreground">{officeTimings}</p>
                            </div>
                          </div>
                        ) : null}
                        {websiteHref ? (
                          <div className="flex items-start gap-3">
                            <Globe className="mt-0.5 h-4 w-4 text-accent" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Website</p>
                              <a href={websiteHref} target="_blank" rel="noreferrer" className="mt-1 inline-flex text-sm text-accent hover:underline">
                                Visit profile website
                              </a>
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <p className="text-sm leading-6 text-muted-foreground">
                        Public details for this agent are still being expanded. Use the contact buttons above to connect directly.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">Agency information</h2>
              </div>
              <div className="mt-5 space-y-4 text-sm text-muted-foreground">
                <div className="rounded-[22px] bg-[#F8FAFC] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Organization
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{displayName}</p>
                </div>
                {profile?.aboutCompany ? (
                  <p className="leading-6">{profile.aboutCompany}</p>
                ) : (
                  <p className="leading-6">
                    Public listings, agents, and branding for this profile are synced directly from {displayName}.
                  </p>
                )}

                <div className="space-y-3 rounded-[22px] border border-slate-100 p-4">
                  {officePhone ? (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 text-accent" />
                      <span>{officePhone}</span>
                    </div>
                  ) : null}
                  {officeEmail ? (
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 text-accent" />
                      <span>{officeEmail}</span>
                    </div>
                  ) : null}
                  {officeAddress ? (
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-accent" />
                      <span>{officeAddress}</span>
                    </div>
                  ) : null}
                  {officeTimings ? (
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 text-accent" />
                      <span>{officeTimings}</span>
                    </div>
                  ) : null}
                </div>

                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href={prefixAgencyPath('/contact', agencySlug)}>
                    Reach {displayName}
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          {(soldListings.length > 0 || rentedListings.length > 0) ? (
            <div className="grid gap-6 xl:grid-cols-2">
              <Card className="rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-accent" />
                  <h3 className="text-xl font-semibold text-foreground">Sold properties</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Recently completed sales attributed to {firstName} within {displayName}.
                </p>
                <div className="mt-5 space-y-4">
                  {soldListings.slice(0, 3).map((listing) => (
                    <div key={listing.id} className="rounded-[24px] border border-slate-100 bg-[#FAFBFF] p-4">
                      <p className="font-semibold text-foreground">{listing.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{listing.location}</p>
                    </div>
                  ))}
                  {soldListings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No public sold properties yet.</p>
                  ) : null}
                </div>
              </Card>

              <Card className="rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <h3 className="text-xl font-semibold text-foreground">Rented properties</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Public rental deals completed by this agent for the organization.
                </p>
                <div className="mt-5 space-y-4">
                  {rentedListings.slice(0, 3).map((listing) => (
                    <div key={listing.id} className="rounded-[24px] border border-slate-100 bg-[#FAFBFF] p-4">
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
          ) : null}

          <div>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Active portfolio
                </p>
                <h2 className="mt-3 text-3xl font-headline font-semibold text-foreground sm:text-4xl">
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
              <Card className="rounded-[32px] border-dashed p-10 text-center text-muted-foreground">
                No active listings are public for this agent yet.
              </Card>
            )}
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
