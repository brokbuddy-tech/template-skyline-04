
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getSiteConfig } from '@/lib/api';
import { resolveAgencySlugFromPathname } from '@/lib/agency-routing';
import type { SiteConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

export function BrandMark() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 52 52"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
    >
      <rect x="4" y="26" width="12" height="18" rx="2" fill="hsl(var(--accent))" />
      <rect x="7" y="29" width="6" height="6" fill="#FFFFFF" fillOpacity="0.92" />
      <rect x="20" y="14" width="12" height="30" rx="2" fill="hsl(var(--accent) / 0.82)" />
      <rect x="23" y="18" width="6" height="6" fill="#FFFFFF" fillOpacity="0.92" />
      <rect x="23" y="28" width="6" height="6" fill="#FFFFFF" fillOpacity="0.35" />
      <path d="M36 44V7.5L47 4V44H36Z" fill="hsl(var(--primary))" />
      <rect x="39" y="11" width="5" height="5" fill="#FFFFFF" fillOpacity="0.9" />
      <rect x="39" y="20" width="5" height="5" fill="#FFFFFF" fillOpacity="0.32" />
      <rect x="39" y="29" width="5" height="5" fill="#FFFFFF" fillOpacity="0.32" />
    </svg>
  );
}

function getDisplayName(siteConfig?: SiteConfig | null) {
  return siteConfig?.branding?.displayName || siteConfig?.organization.name || 'Agency Website';
}

function getLogoUrl(siteConfig?: SiteConfig | null) {
  return siteConfig?.profile?.logo || null;
}

function getTagline(siteConfig?: SiteConfig | null) {
  return (
    siteConfig?.branding?.tagline
    || siteConfig?.leadAgent?.title
    || siteConfig?.leadAgent?.tagline
    || siteConfig?.profile?.aboutCompany
    || siteConfig?.profile?.officeAddress
    || 'Public real estate website'
  );
}

export function Logo({
  className,
  initialSiteConfig,
}: {
  className?: string;
  initialSiteConfig?: SiteConfig | null;
}) {
  const pathname = usePathname();
  const agencySlug = resolveAgencySlugFromPathname(pathname);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(initialSiteConfig ?? null);

  useEffect(() => {
    setSiteConfig((current) => initialSiteConfig ?? current ?? null);
  }, [initialSiteConfig]);

  useEffect(() => {
    let active = true;

    async function loadSiteConfig() {
      try {
        const nextSiteConfig = await getSiteConfig(agencySlug);
        if (active) {
          setSiteConfig(nextSiteConfig);
        }
      } catch {
        if (active) {
          setSiteConfig((current) => current ?? initialSiteConfig ?? null);
        }
      }
    }

    void loadSiteConfig();

    return () => {
      active = false;
    };
  }, [agencySlug, initialSiteConfig]);

  const displayName = getDisplayName(siteConfig);
  const logoUrl = getLogoUrl(siteConfig);
  const tagline = getTagline(siteConfig);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${displayName} logo`}
            width={44}
            height={44}
            className="h-full w-full object-contain"
            unoptimized
          />
        ) : (
          <BrandMark />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-black uppercase tracking-[0.18em] text-foreground">
          {displayName}
        </p>
        <p className="truncate text-[11px] font-medium text-muted-foreground">
          {tagline}
        </p>
      </div>
    </div>
  );
}
