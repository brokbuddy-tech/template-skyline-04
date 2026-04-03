
import type { LucideIcon } from 'lucide-react';

export type PropertyStatus = 'Off-plan' | 'Ready';
export type PropertyTransactionType = 'Sale' | 'Rent';

export type PropertyAgent = {
  id?: string;
  name: string;
  title?: string;
  avatarUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  company?: string;
  licenseNumber?: string | null;
  slug?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
};

export type Property = {
  id: string;
  title: string;
  location: string;
  mapAddress?: string;
  price: number;
  currency?: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
  amenities: string[];
  images: string[];
  description: string;
  referenceId?: string;
  trakheesi?: string;
  reraPermit?: string;
  dldPermitLink?: string | null;
  featured?: boolean;
  status?: PropertyStatus;
  transactionType: PropertyTransactionType;
  photoCount?: number;
  tag?: string;
  developerLogo?: string;
  developerName?: string;
  category?: string;
  nearby?: { name: string; time: string }[];
  handoverDate?: string;
  latitude?: number | null;
  longitude?: number | null;
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
};

export type SiteAgent = {
  id?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  avatar?: string | null;
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

export type SiteConfig = {
  organization: {
    id?: string;
    name: string;
    slug: string;
    country?: string | null;
  };
  categories: string[];
  amenities: string[];
  featuredAreas?: string[];
  leadAgent?: SiteAgent | null;
  branding?: SiteBranding | null;
  stats?: SiteStats;
};
