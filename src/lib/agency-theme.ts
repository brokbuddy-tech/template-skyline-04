import type { CSSProperties } from 'react';
import type { SiteProfile } from './types';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeHexColor(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const normalized = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
  if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(normalized)) {
    return null;
  }

  if (normalized.length === 3) {
    return `#${normalized.split('').map((character) => `${character}${character}`).join('')}`;
  }

  return `#${normalized}`;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;

  const value = normalized.slice(1);
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  if ([red, green, blue].some((channel) => Number.isNaN(channel))) {
    return null;
  }

  return { red, green, blue };
}

function rgbToHslTokens(red: number, green: number, blue: number) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  if (delta !== 0) {
    switch (max) {
      case r:
        hue = ((g - b) / delta) % 6;
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      default:
        hue = (r - g) / delta + 4;
        break;
    }
  }

  const saturation =
    delta === 0
      ? 0
      : delta / (1 - Math.abs(2 * lightness - 1));

  const normalizedHue = Math.round((hue * 60 + 360) % 360);
  const normalizedSaturation = clamp(Math.round(saturation * 100), 0, 100);
  const normalizedLightness = clamp(Math.round(lightness * 100), 0, 100);

  return `${normalizedHue} ${normalizedSaturation}% ${normalizedLightness}%`;
}

function getReadableForegroundTokens(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return '0 0% 98%';
  }

  const luminance = (0.2126 * rgb.red + 0.7152 * rgb.green + 0.0722 * rgb.blue) / 255;
  return luminance > 0.6 ? '0 0% 4%' : '0 0% 98%';
}

function toHslTokens(hex?: string | null, fallback = '211 100% 50%') {
  const rgb = hexToRgb(hex || '');
  if (!rgb) return fallback;
  return rgbToHslTokens(rgb.red, rgb.green, rgb.blue);
}

export function buildAgencyThemeStyle(profile?: SiteProfile | null): CSSProperties | undefined {
  if (!profile?.primaryColor && !profile?.secondaryColor) {
    return undefined;
  }

  const primaryColor = normalizeHexColor(profile.primaryColor) || '#1E88E5';
  const secondaryColor = normalizeHexColor(profile.secondaryColor) || '#0F172A';

  return {
    '--accent': toHslTokens(primaryColor),
    '--ring': toHslTokens(primaryColor),
    '--primary': toHslTokens(secondaryColor, '0 0% 4%'),
    '--primary-foreground': getReadableForegroundTokens(secondaryColor),
    '--agency-primary-hex': primaryColor,
    '--agency-secondary-hex': secondaryColor,
  } as CSSProperties;
}
