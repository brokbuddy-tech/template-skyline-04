'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Home,
  KeyRound,
  Mail,
  MessageCircle,
  Phone,
  Save,
  Square,
  UserRoundPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewCarousel } from '@/components/review-carousel';
import { CurrencyContext } from '@/context/currency-context';
import { prefixAgencyPath } from '@/lib/agency-routing';
import { cn } from '@/lib/utils';
import { ProgressiveImage } from './progressive-image';
import type { Property } from '@/lib/types';
import type { ReviewCarouselItem } from '@/lib/reviews';
import type { ResolvedImage } from '@/lib/property-media';

type SectionId = 'biography' | 'listings' | 'reviews' | 'specialities';
type ListingFilter = 'all' | 'sale' | 'rent';

type SpecialtyCard = {
  eyebrow: string;
  title: string;
  image: ResolvedImage | null;
};

type StatCard = {
  value: string;
  label: string;
};

type LiveStats = {
  activeListings: number;
  soldListings: number;
  rentedListings: number;
};

type AgentProfileExperienceProps = {
  agencySlug?: string | null;
  agentName: string;
  headline: string;
  displayName: string;
  brn?: string | null;
  avatar: ResolvedImage | null;
  coverImage: ResolvedImage | null;
  profileSummary: string;
  yearsExperience?: number | null;
  languages?: string[] | null;
  specializations?: string[] | null;
  liveStats: LiveStats;
  biography: string[];
  reviewCountLabel: string;
  whatsappHref: string | null;
  phoneHref: string | null;
  email: string | null;
  officePhone: string | null;
  featuredListings: Property[];
  reviewCards: ReviewCarouselItem[];
  specialtyCards: SpecialtyCard[];
  statCards: StatCard[];
};

const sectionItems: Array<{ id: SectionId; label: string }> = [
  { id: 'biography', label: 'Biography' },
  { id: 'listings', label: 'Listings' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'specialities', label: 'Specialities' },
];

const sectionItemsWithoutReviews = sectionItems.filter((item) => item.id !== 'reviews');

const listingFilters: Array<{ id: ListingFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'sale', label: 'Sale' },
  { id: 'rent', label: 'Rent' },
];

function formatSqft(value: number) {
  return `${Math.round(value || 0).toLocaleString()} sq ft`;
}

function buildVCardHref({
  agentName,
  headline,
  displayName,
  phone,
  email,
}: {
  agentName: string;
  headline: string;
  displayName: string;
  phone?: string | null;
  email?: string | null;
}) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${agentName}`,
    `ORG:${displayName}`,
    `TITLE:${headline}`,
    phone ? `TEL;TYPE=CELL:${phone}` : '',
    email ? `EMAIL;TYPE=INTERNET:${email}` : '',
    'END:VCARD',
  ].filter(Boolean);

  return `data:text/vcard;charset=utf-8,${encodeURIComponent(lines.join('\n'))}`;
}

function PropertyShowcaseCard({
  property,
  agencySlug,
}: {
  property: Property;
  agencySlug?: string | null;
}) {
  const { formatPrice } = useContext(CurrencyContext);
  const image = property.media?.[0] || property.images[0];
  const badgeLabel = property.transactionType === 'Rent' ? 'RENT' : 'SALE';

  return (
    <Link href={prefixAgencyPath(`/properties/${property.id}`, agencySlug)} className="block">
      <article className="overflow-hidden rounded-[30px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:-translate-y-1">
        <div className="relative h-[320px] overflow-hidden bg-slate-200">
          {image ? (
            <ProgressiveImage
              source={image}
              alt={property.title}
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              imageClassName="object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-[0.24em] text-[#21479b] shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
            {badgeLabel}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="convert-price text-[28px] font-bold tracking-tight text-white" data-usd-price={property.price}>
              {formatPrice(property.price)}
            </p>
          </div>
        </div>

        <div className="p-7">
          <h3 className="text-[24px] font-semibold tracking-tight text-[#08152f]">
            {property.title}
          </h3>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6 text-[#21479b]">
            <div className="flex items-center gap-2 text-[16px] font-medium">
              <BedDouble className="h-5 w-5" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-2 text-[16px] font-medium">
              <Bath className="h-5 w-5" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-[16px] font-medium">
              <Square className="h-5 w-5" />
              <span>{formatSqft(property.sqft)}</span>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex h-14 items-center justify-center rounded-[18px] bg-[#eef2f8] text-[18px] font-semibold text-[#21479b]">
              <span>View Details</span>
              <ArrowUpRight className="ml-3 h-5 w-5" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function AgentProfileExperience({
  agencySlug,
  agentName,
  headline,
  displayName,
  brn,
  avatar,
  coverImage,
  profileSummary,
  yearsExperience,
  languages,
  specializations,
  liveStats,
  biography,
  reviewCountLabel,
  whatsappHref,
  phoneHref,
  email,
  officePhone,
  featuredListings,
  reviewCards,
  specialtyCards,
  statCards,
}: AgentProfileExperienceProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('biography');
  const [listingFilter, setListingFilter] = useState<ListingFilter>('all');
  const visibleSectionItems = useMemo(
    () => (reviewCards.length > 0 ? sectionItems : sectionItemsWithoutReviews),
    [reviewCards.length],
  );

  useEffect(() => {
    const sections = visibleSectionItems
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const stickyOffset = 180;
    let frameId = 0;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + stickyOffset;
      let nextActiveSection = sections[0].id as SectionId;

      for (const section of sections) {
        if (section.offsetTop <= scrollPosition) {
          nextActiveSection = section.id as SectionId;
        }
      }

      setActiveSection(current => (current === nextActiveSection ? current : nextActiveSection));
    };

    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [visibleSectionItems]);

  const scrollToSection = (sectionId: SectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    setActiveSection(sectionId);
    const top = section.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const saveContactHref = buildVCardHref({
    agentName,
    headline,
    displayName,
    phone: officePhone || phoneHref?.replace(/^tel:/, '') || null,
    email,
  });

  const filteredListings = featuredListings.filter(property => {
    if (listingFilter === 'sale') return property.transactionType === 'Sale';
    if (listingFilter === 'rent') return property.transactionType === 'Rent';
    return true;
  });
  const inquiryLinks = [
    {
      title: 'Buying',
      description: 'Find a new property',
      href: prefixAgencyPath('/properties?type=buy', agencySlug),
      icon: Home,
    },
    {
      title: 'Selling',
      description: 'List your property',
      href: prefixAgencyPath('/sell', agencySlug),
      icon: UserRoundPlus,
    },
    {
      title: 'Renting',
      description: 'Find premium rentals',
      href: prefixAgencyPath('/properties?type=rent', agencySlug),
      icon: KeyRound,
    },
  ];

  return (
    <div className="bg-white text-[#08152f]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#08152f] px-4 py-16 text-white sm:px-5 lg:py-20">
        <div className="absolute inset-0 bg-[#a3a3a3]">
          {coverImage ? (
            <Image
              src={coverImage.src}
              alt={coverImage.alt}
              fill
              className="object-cover grayscale"
              data-ai-hint={coverImage.hint}
              unoptimized={coverImage.unoptimized}
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-[#08152f]/80" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1600px] grid-cols-1 items-end gap-12 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="relative aspect-square w-full max-w-[280px] overflow-hidden border border-white/15 bg-white/10 shadow-[0_28px_70px_rgba(0,0,0,0.28)]">
            {avatar ? (
              <Image
                src={avatar.src}
                alt={avatar.alt}
                fill
                className="object-cover object-top"
                data-ai-hint={avatar.hint}
                unoptimized={avatar.unoptimized}
              />
            ) : null}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.32em] text-[#4fd8ff]">{displayName}</p>
              <h1 className="mt-4 text-[40px] font-semibold tracking-[-0.04em] text-white sm:text-[54px] lg:text-[66px]">
                {agentName}
              </h1>
              <p className="mt-3 text-[18px] font-medium text-white/70 sm:text-[24px]">
                {headline}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-[16px] font-medium text-white/80">
              {brn ? (
                <span className="flex items-center gap-2">
                  <span className="text-[#4fd8ff]">BRN</span>
                  {brn}
                </span>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-[#4fd8ff]">
                  <Mail className="h-5 w-5 text-[#4fd8ff]" />
                  {email}
                </a>
              ) : null}
              {phoneHref ? (
                <a href={phoneHref} className="flex items-center gap-2 hover:text-[#4fd8ff]">
                  <Phone className="h-5 w-5 text-[#4fd8ff]" />
                  {phoneHref.replace(/^tel:/, '')}
                </a>
              ) : null}
              {whatsappHref ? (
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#4fd8ff]">
                  <MessageCircle className="h-5 w-5 text-[#4fd8ff]" />
                  WhatsApp
                </a>
              ) : null}
            </div>

            <p className="text-[15px] font-semibold text-white/65">
              5.0 client rating <span className="font-normal">({reviewCountLabel})</span>
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-14 rounded-full bg-[#25d366] px-8 text-[18px] font-semibold text-white hover:bg-[#20c15d] sm:h-16 sm:px-10"
                >
                  <a href={whatsappHref || phoneHref || prefixAgencyPath('/contact', agencySlug)} target={whatsappHref ? '_blank' : undefined} rel="noreferrer">
                    <MessageCircle className="mr-3 h-5 w-5" />
                    WhatsApp
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-14 rounded-full border-[#21479b] px-8 text-[18px] font-semibold text-[#21479b] hover:bg-[#21479b]/5 sm:h-16 sm:px-10"
                >
                  <a href={saveContactHref} download={`${agentName.replace(/\s+/g, '-').toLowerCase()}.vcf`}>
                    <Save className="mr-3 h-5 w-5" />
                    Save Contact
                  </a>
                </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[80px] z-30 border-y border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto grid max-w-[1600px] grid-cols-4 items-center gap-1 px-2 sm:flex sm:justify-center sm:gap-8 sm:px-4">
          {visibleSectionItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={cn(
                'flex min-w-0 w-full items-center justify-center border-b-2 px-0.5 py-3 text-center text-[10px] font-semibold leading-tight whitespace-normal transition-colors sm:w-auto sm:px-2 sm:py-3 sm:text-[18px] sm:whitespace-nowrap',
                activeSection === item.id
                  ? 'border-[#21479b] text-[#21479b]'
                  : 'border-transparent text-[#586786] hover:text-[#21479b]',
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <section id="biography" className="scroll-mt-40 bg-[#f5f7fb] px-4 py-20 sm:px-5 lg:py-28">
        <div className="mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <aside className="space-y-10">
            <div className="space-y-6 rounded-[30px] border border-[#d7deea] bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
              <h2 className="text-[14px] font-bold uppercase tracking-[0.28em] text-[#21479b]">Profile</h2>
              <div className="space-y-5 text-[18px] leading-[1.65] text-[#4f648a]">
                <p>{profileSummary}</p>
                <div className="space-y-4">
                  {languages && languages.length > 0 ? (
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#8b99b0]">Languages</p>
                      <p>{languages.join(', ')}</p>
                    </div>
                  ) : null}
                  {specializations && specializations.length > 0 ? (
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#8b99b0]">Specializations</p>
                      <p>{specializations.join(', ')}</p>
                    </div>
                  ) : null}
                  {yearsExperience ? (
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#8b99b0]">Experience</p>
                      <p>{yearsExperience}+ years</p>
                    </div>
                  ) : null}
                  {brn ? (
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#8b99b0]">BRN</p>
                      <p>{brn}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-6 rounded-[30px] border border-[#d7deea] bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
              <h2 className="text-[14px] font-bold uppercase tracking-[0.28em] text-[#21479b]">Live Stats</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[28px] font-semibold tracking-[-0.04em] text-[#0f1d3a]">{liveStats.activeListings}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b99b0]">Active</p>
                </div>
                <div>
                  <p className="text-[28px] font-semibold tracking-[-0.04em] text-[#0f1d3a]">{liveStats.soldListings}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b99b0]">Sold</p>
                </div>
                <div>
                  <p className="text-[28px] font-semibold tracking-[-0.04em] text-[#0f1d3a]">{liveStats.rentedListings}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b99b0]">Rented</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-start">
            <div>
              <h2 className="text-[40px] font-semibold tracking-[-0.04em] text-[#0f1d3a] sm:text-[54px]">
                Biography
              </h2>
              <div className="mt-8 space-y-8 text-[20px] leading-[1.72] text-[#4f648a] sm:text-[24px]">
                {biography.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-12">
                <Button
                  asChild
                  className="h-16 rounded-full bg-[#25d366] px-10 text-[20px] font-semibold text-white hover:bg-[#20c15d]"
                >
                  <a href={whatsappHref || phoneHref || prefixAgencyPath('/contact', agencySlug)} target={whatsappHref ? '_blank' : undefined} rel="noreferrer">
                    <MessageCircle className="mr-3 h-5 w-5" />
                    Discuss My Vision
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-[36px] bg-white p-7 shadow-[0_30px_75px_rgba(15,23,42,0.12)] sm:p-10">
              <div className="flex items-center justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold uppercase tracking-[0.18em] text-[#21479b]">
                    Step 1 of 3
                  </p>
                  <div className="mt-4 h-3 rounded-full bg-[#e6e8ef]">
                    <div className="h-full w-1/3 rounded-full bg-[#21479b]" />
                  </div>
                </div>
                <p className="text-[18px] font-medium text-[#4f648a]">Quick Inquiry</p>
              </div>

              <h3 className="mt-12 text-[34px] font-semibold tracking-[-0.04em] text-[#0f1d3a]">
                I am interested in...
              </h3>

              <div className="mt-10 space-y-5">
                {inquiryLinks.map(item => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-5 rounded-[28px] border border-[#d7deea] bg-white p-6 transition-colors hover:border-[#21479b]/40 hover:bg-[#f9fbff]"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#eef2f8] text-[#21479b]">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-[22px] font-semibold text-[#0f1d3a]">{item.title}</p>
                      <p className="mt-1 text-[16px] text-[#4f648a]">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="listings" className="scroll-mt-40 bg-[#f5f7fb] px-4 pb-24 sm:px-5 lg:pb-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[820px]">
              <h2 className="text-[40px] font-semibold tracking-[-0.04em] text-[#0f1d3a] sm:text-[54px]">
                Featured Listings
              </h2>
              <p className="mt-4 text-[20px] leading-[1.6] text-[#4f648a] sm:text-[24px]">
                Curated premium properties across the most prestigious locations represented by {agentName}.
              </p>
            </div>

            <div className="inline-flex rounded-full border border-[#d6dce8] bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              {listingFilters.map(filter => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setListingFilter(filter.id)}
                  className={cn(
                    'min-w-[100px] rounded-full px-7 py-3 text-[18px] font-semibold transition-colors',
                    listingFilter === filter.id
                      ? 'bg-[#21479b] text-white'
                      : 'text-[#4f648a] hover:text-[#21479b]',
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredListings.map(property => (
              <PropertyShowcaseCard
                key={property.id}
                property={property}
                agencySlug={agencySlug}
              />
            ))}
          </div>

          {filteredListings.length === 0 ? (
            <div className="mt-10 rounded-[28px] border border-dashed border-[#d6dce8] bg-white p-10 text-center text-[18px] text-[#4f648a]">
              No public listings are available in this filter yet.
            </div>
          ) : null}

          <div className="mt-14 flex justify-center">
            <Button
              asChild
              variant="outline"
              className="h-16 rounded-full border-[#21479b] px-12 text-[20px] font-semibold text-[#21479b] hover:bg-[#21479b]/5"
            >
              <Link href={prefixAgencyPath('/properties', agencySlug)}>
                View All Properties
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {reviewCards.length > 0 ? (
        <div id="reviews" className="scroll-mt-40">
          <ReviewCarousel
            title="What My Clients Say"
            description="Verified feedback from clients who found their perfect space through my guidance."
            items={reviewCards}
            variant="blue"
            className="px-0"
          />
        </div>
      ) : null}

      <section id="specialities" className="scroll-mt-40 bg-white">
        <div className="px-4 py-20 sm:px-5 lg:py-24">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-[850px]">
                <h2 className="text-[40px] font-semibold tracking-[-0.04em] text-[#0f1d3a] sm:text-[54px]">
                  Areas of Speciality
                </h2>
                <p className="mt-5 text-[20px] leading-[1.65] text-[#4f648a] sm:text-[24px]">
                  I focus on the most vibrant and high-yield neighborhoods, pairing local insight with sharper negotiation and lifestyle matching.
                </p>
              </div>

              <div className="grid gap-20 sm:grid-cols-3">
                {statCards.map(card => (
                  <div
                    key={card.label}
                    className="flex h-[120px] w-full min-w-[160px] flex-col items-center justify-center rounded-[20px] border border-[#dde3ee] bg-white px-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                  >
                    <p className="text-[24px] font-semibold tracking-[-0.04em] text-[#21479b]">
                      {card.value}
                    </p>
                    <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.24em] text-[#586786]">
                      {card.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 grid gap-10 xl:grid-cols-3">
              {specialtyCards.map(card => (
                <article
                  key={`${card.eyebrow}-${card.title}`}
                  className="overflow-hidden rounded-[34px] bg-slate-200 shadow-[0_20px_55px_rgba(15,23,42,0.18)]"
                >
                  <div className="relative aspect-[1.05]">
                    {card.image ? (
                      <Image
                        src={card.image.src}
                        alt={card.image.alt}
                        fill
                        className="object-cover"
                        data-ai-hint={card.image.hint}
                        unoptimized={card.image.unoptimized}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/18 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                      <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#44dcff]">
                        {card.eyebrow}
                      </p>
                      <h3 className="mt-4 text-[32px] font-semibold tracking-[-0.04em] text-white sm:text-[40px]">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
