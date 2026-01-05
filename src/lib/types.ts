import type { LucideIcon } from 'lucide-react';

export type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'House' | 'Apartment' | 'Penthouse' | 'Townhouse' | 'Villa' | 'Office Space' | 'Hotel Apartment' | 'Duplex' | 'Retail' | 'Warehouse' | 'Building' | 'Land' | 'StaffAccommodation';
  amenities: string[];
  images: string[];
  description: string;
  referenceId?: string;
  trakheesi?: string;
  reraPermit?: string;
  featured?: boolean;
  status?: 'Off-plan' | 'Ready';
  transactionType: 'Sale' | 'Rent';
  photoCount?: number;
  tag?: string;
  developerLogo?: 'Emaar' | 'Nakheel';
  category?: string;
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
