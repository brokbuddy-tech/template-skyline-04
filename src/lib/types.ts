import type { LucideIcon } from 'lucide-react';
import type { BrokerReviewSources } from './reviews';

export type PropertyStatus = 'Off-plan' | 'Ready';
export type PropertyTransactionType = 'Sale' | 'Rent';
export type PropertyImageSource = {
  id?: string | null;
  src: string;
  thumbnailSrc?: string | null;
  originalSrc?: string | null;
  alt?: string;
  hint?: string;
  status?: string | null;
  isPlaceholder?: boolean;
  unoptimized?: boolean;
};

export type PropertyImage = string | PropertyImageSource;

export type PropertyAgent = {
  id?: string;
  name: string;
  title?: string;
  avatarUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  company?: string;
  brn?: string | null;
  licenseNumber?: string | null;
  slug?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
};

export type PropertyMedia = {
  url: string;
  thumbnailUrl: string | null;
  mediumUrl: string | null;
  cdnUrl: string | null;
};

export type Property = {
  id: string;
  title: string;
  location: string;
  mapAddress?: string;
  searchableText?: string;
  searchableLocation?: string;
  price: number;
  currency?: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
  amenities: string[];
  images: PropertyImage[];
  media?: PropertyMedia[];
  description: string;
  referenceId?: string;
  trakheesi?: string;
  reraPermit?: string;
  dldPermitLink?: string | null;
  status?: PropertyStatus;
  transactionType: PropertyTransactionType;
  photoCount?: number;
  tag?: string;
  featured?: boolean;
  developerLogo?: string;
  developerName?: string;
  category?: string;
  nearby?: { name: string; time: string }[];
  handoverDate?: string;
  latitude?: number | null;
  longitude?: number | null;
  virtualTourUrl?: string | null;
  paymentPlanData?: Record<string, unknown> | null;
  constructionTimelineData?: Record<string, unknown> | null;
  organizationName?: string;
  organizationSlug?: string;
  agent?: PropertyAgent;
};

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Testimonial = {
  id?: string;
  quote: string;
  author: string;
  location?: string;
  image?: string | null;
  rating: number;
  badgeLabel?: string | null;
};

export type SiteAgent = {
  id?: string;
  name: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  brn?: string | null;
  licenseNumber?: string | null;
  slug?: string | null;
  tagline?: string | null;
  bio?: string | null;
  website?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  specializations?: string[];
  languages?: string[];
  yearsExperience?: number | null;
  totalDeals?: number;
  totalListings?: number;
  primaryColor?: string | null;
  coverImage?: string | null;
  coverImageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  reviewSources?: BrokerReviewSources | null;
};

export type SiteBranding = {
  displayName?: string | null;
  tagline?: string | null;
  bio?: string | null;
  publicEmail?: string | null;
  publicPhone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  primaryColor?: string | null;
  coverImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type SiteStats = {
  totalListings: number;
  readyListings: number;
  offPlanListings: number;
  activeAgents: number;
  awards: number;
  blogs: number;
  testimonials: number;
};

export type SiteProfile = {
  logo?: string | null;
  aboutCompany?: string;
  mission?: string;
  vision?: string;
  officeAddress?: string;
  officeTimings?: string;
  primaryColor?: string;
  secondaryColor?: string;
  contact?: {
    primaryPhone?: string;
    secondaryPhone?: string;
    whatsappNumber?: string;
    officialEmail?: string;
  };
  social?: {
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    twitterUrl?: string;
    youtubeUrl?: string;
  };
  footer?: {
    copyrightSuffix?: string;
    privacyPolicyText?: string;
    termsAndConditionsText?: string;
  };
};

export type SiteConfig = {
  organization: {
    id?: string;
    name: string;
    slug: string;
    hexCode?: string;
    templateUrl?: string | null;
    publicAgencyUrl?: string | null;
    country?: string | null;
  };
  categories: string[];
  amenities: string[];
  featuredAreas?: string[];
  leadAgent?: SiteAgent | null;
  branding?: SiteBranding | null;
  profile?: SiteProfile | null;
  stats?: SiteStats;
};
