'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BrandMark, Logo } from './logo';
import type { SiteConfig } from '@/lib/types';

function getDisplayName(siteConfig?: SiteConfig | null) {
  return siteConfig?.branding?.displayName || siteConfig?.organization.name || 'Agency Website';
}

function getTagline(siteConfig?: SiteConfig | null) {
  return siteConfig?.branding?.tagline || siteConfig?.profile?.officeAddress || 'Public real estate website';
}

export function SplashScreen({
  isLoading,
  initialSiteConfig,
}: {
  isLoading: boolean;
  initialSiteConfig?: SiteConfig | null;
}) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 0); // Start fade-out immediately when loading is done
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isLoading]);

  const displayName = getDisplayName(initialSiteConfig);
  const tagline = getTagline(initialSiteConfig);
  const logoUrl = initialSiteConfig?.profile?.logo || null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-400',
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      {initialSiteConfig ? (
        <div className="flex items-center gap-3">
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
      ) : (
        <Logo initialSiteConfig={initialSiteConfig} />
      )}
      <div className="mt-5 w-[200px] h-[2px] bg-[#EAEAEA] rounded-full overflow-hidden">
        <div className="h-full bg-accent animate-load-in"></div>
      </div>
    </div>
  );
}
