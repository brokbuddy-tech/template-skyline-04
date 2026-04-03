import { PlaceHolderImages } from './placeholder-images';

type ResolvedImage = {
  src: string;
  alt: string;
  hint?: string;
  unoptimized: boolean;
};

export function resolveImage(source?: string | null, fallbackId = 'prop-1-1'): ResolvedImage | null {
  const normalizedSource = source?.trim();
  const placeholder =
    PlaceHolderImages.find(image => image.id === normalizedSource) ||
    PlaceHolderImages.find(image => image.id === fallbackId);

  if (!normalizedSource && !placeholder) return null;

  if (placeholder && (!normalizedSource || placeholder.id === normalizedSource)) {
    return {
      src: placeholder.imageUrl,
      alt: placeholder.description,
      hint: placeholder.imageHint,
      unoptimized: false,
    };
  }

  const resolvedSource = normalizedSource || placeholder!.imageUrl;

  return {
    src: resolvedSource,
    alt: 'Property image',
    hint: 'property',
    unoptimized: /^https?:\/\//i.test(resolvedSource) || /^\/api\//i.test(resolvedSource),
  };
}
