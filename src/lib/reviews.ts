export type VerifiedReviewSource = 'GOOGLE_VERIFIED' | 'TRUSTPILOT_VERIFIED';

export type GoogleReviewItem = {
  id: string;
  authorName: string;
  rating: number;
  message: string;
  source: 'GOOGLE_VERIFIED';
  googleMapsUri: string | null;
  googleAuthorUri: string | null;
  googleAuthorPhotoUri: string | null;
  publishedAt: string | null;
  importedAt: string | null;
};

export type BrokerReviewSources = {
  googleReviews?: {
    googlePlaceId?: string;
    googlePlaceName?: string;
    googleMapsUri?: string;
    googleRating?: number | null;
    googleUserRatingCount?: number | null;
    lastGoogleReviewSyncAt?: string | null;
    reviews?: GoogleReviewItem[];
  } | null;
  trustpilotReviews?: {
    trustpilotBusinessUnitId?: string;
    trustpilotProfileUrl?: string;
    trustpilotTrustBoxWidgetId?: string;
    trustpilotStatus?: string;
    trustpilotRating?: number | null;
    trustpilotReviewCount?: number | null;
    lastTrustpilotSyncAt?: string | null;
  } | null;
};

export type ReviewCarouselItem = {
  id: string;
  quote: string;
  author: string;
  rating: number;
  badgeLabel: string;
  image: string | null;
  location: string | null;
};

function trimText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function clampRating(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 5;
  return Math.min(Math.max(Math.round(value), 1), 5);
}

function badgeForSource(source: unknown, fallback = 'Client testimonial') {
  if (source === 'GOOGLE' || source === 'GOOGLE_VERIFIED') return 'Verified via Google';
  if (source === 'TRUSTPILOT_VERIFIED') return 'Verified via Trustpilot';
  return fallback;
}

export function normalizePublicTestimonials(input: unknown[] = []): ReviewCarouselItem[] {
  return input
    .map((item, index): ReviewCarouselItem | null => {
      const testimonial = (item || {}) as Record<string, unknown>;
      const quote = trimText(testimonial.message) || trimText(testimonial.quote) || trimText(testimonial.content);
      if (!quote) return null;

      const author =
        trimText(testimonial.author) ||
        trimText(testimonial.name) ||
        trimText(testimonial.clientName) ||
        'Anonymous';
      const badgeLabel = trimText(testimonial.badgeLabel) || badgeForSource(testimonial.source);
      const image =
        trimText(testimonial.imageUrl) ||
        trimText(testimonial.googleAuthorPhotoUri) ||
        trimText(testimonial.image) ||
        trimText(testimonial.imageId) ||
        null;

      return {
        id: trimText(testimonial.id) || `${author}-${index}`,
        quote,
        author,
        rating: clampRating(testimonial.rating),
        badgeLabel,
        image,
        location: trimText(testimonial.location) || trimText(testimonial.property) || null,
      };
    })
    .filter((item): item is ReviewCarouselItem => Boolean(item));
}

export function normalizeBrokerReviewCards(reviewSources?: BrokerReviewSources | null): ReviewCarouselItem[] {
  return (reviewSources?.googleReviews?.reviews || [])
    .map((review, index): ReviewCarouselItem | null => {
      const quote = trimText(review.message);
      const author = trimText(review.authorName) || 'Google reviewer';
      if (!quote) return null;

      return {
        id: trimText(review.id) || `${author}-${index}`,
        quote,
        author,
        rating: clampRating(review.rating),
        badgeLabel: badgeForSource(review.source, 'Verified via Google'),
        image: trimText(review.googleAuthorPhotoUri) || null,
        location: null,
      };
    })
    .filter((item): item is ReviewCarouselItem => Boolean(item));
}
