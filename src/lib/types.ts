import type { LucideIcon } from 'lucide-react';

export type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'House' | 'Apartment' | 'Penthouse';
  amenities: string[];
  images: string[];
  description: string;
  referenceId?: string;
  trakheesi?: string;
  reraPermit?: string;
};

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  location: string;
  image: string;
  rating: number;
};
