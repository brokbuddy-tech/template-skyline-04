'use client';

import { useEffect, useRef } from 'react';
import { getClientTemplateFetchUrl } from '@/lib/api-base';

type ListingViewTrackerProps = {
  canonicalListingId: string;
  agencySlug?: string | null;
};

export function ListingViewTracker({
  canonicalListingId,
  agencySlug,
}: ListingViewTrackerProps) {
  const trackedViewKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const listingId = canonicalListingId.trim();
    if (!listingId) return;

    const viewKey = `${agencySlug?.trim() || ''}:${listingId}`;
    if (trackedViewKeyRef.current === viewKey) return;
    trackedViewKeyRef.current = viewKey;

    void fetch(
      getClientTemplateFetchUrl(`/listing-views/${encodeURIComponent(listingId)}`, agencySlug),
      {
        method: 'POST',
        cache: 'no-store',
        keepalive: true,
      },
    ).catch(() => undefined);
  }, [agencySlug, canonicalListingId]);

  return null;
}
