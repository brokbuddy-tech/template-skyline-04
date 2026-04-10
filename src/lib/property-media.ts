import { PlaceHolderImages } from './placeholder-images';
import type { PropertyImage, PropertyImageSource } from './types';

export type ResolvedImage = {
  src: string;
  previewSrc: string;
  originalSrc: string;
  alt: string;
  hint?: string;
  unoptimized: boolean;
  status?: string | null;
  isPlaceholder?: boolean;
};

function isPropertyImageSource(source?: PropertyImage | null): source is PropertyImageSource {
  return Boolean(source && typeof source === 'object' && 'src' in source);
}

function shouldUseUnoptimized(value?: string | null) {
  const normalized = value?.trim();
  return Boolean(normalized && (/^https?:\/\//i.test(normalized) || /^\/api\//i.test(normalized)));
}

function resolvePlaceholder(source?: string | null, fallbackId = 'prop-1-1') {
  const normalizedSource = source?.trim();

  return (
    PlaceHolderImages.find(image => image.id === normalizedSource) ||
    PlaceHolderImages.find(image => image.id === fallbackId)
  );
}

export function resolveImage(
  source?: PropertyImage | null,
  fallbackId = 'prop-1-1',
  alt?: string
): ResolvedImage | null {
  if (isPropertyImageSource(source)) {
    const src = source.src?.trim();
    if (!src) {
      const placeholder = resolvePlaceholder(undefined, fallbackId);
      if (!placeholder) return null;

      return {
        src: placeholder.imageUrl,
        previewSrc: placeholder.imageUrl,
        originalSrc: placeholder.imageUrl,
        alt: alt || placeholder.description,
        hint: placeholder.imageHint,
        unoptimized: false,
        isPlaceholder: true,
      };
    }

    const previewSrc = source.thumbnailSrc?.trim() || src;
    const originalSrc = source.originalSrc?.trim() || src;

    return {
      src,
      previewSrc,
      originalSrc,
      alt: alt || source.alt || 'Property image',
      hint: source.hint || 'property',
      unoptimized:
        source.unoptimized ?? [src, previewSrc, originalSrc].some(candidate => shouldUseUnoptimized(candidate)),
      status: source.status ?? null,
      isPlaceholder: Boolean(source.isPlaceholder),
    };
  }

  const normalizedSource = source?.trim();
  const placeholder = resolvePlaceholder(normalizedSource, fallbackId);

  if (!normalizedSource && !placeholder) return null;

  if (placeholder && (!normalizedSource || placeholder.id === normalizedSource)) {
    return {
      src: placeholder.imageUrl,
      previewSrc: placeholder.imageUrl,
      originalSrc: placeholder.imageUrl,
      alt: alt || placeholder.description,
      hint: placeholder.imageHint,
      unoptimized: false,
      isPlaceholder: true,
    };
  }

  const resolvedSource = normalizedSource || placeholder!.imageUrl;

  return {
    src: resolvedSource,
    previewSrc: resolvedSource,
    originalSrc: resolvedSource,
    alt: alt || 'Property image',
    hint: 'property',
    unoptimized: /^https?:\/\//i.test(resolvedSource) || /^\/api\//i.test(resolvedSource),
  };
}
