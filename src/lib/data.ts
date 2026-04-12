
import type { Property, Service, Testimonial } from './types';
import { Award, Handshake, KeyRound, Search } from 'lucide-react';

export const services: Service[] = [
  {
    icon: Search,
    title: 'Buy a Home',
    description: 'Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.',
  },
  {
    icon: Handshake,
    title: 'Sell a Home',
    description: 'No matter what path you take to sell your home, we can help you navigate a successful sale.',
  },
  {
    icon: KeyRound,
    title: 'Rent a Home',
    description: 'We’re creating a seamless online experience – from shopping on the largest rental network, to applying, to paying rent.',
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: "Working with Monks was a revelation. Their attention to detail and commitment to our vision was unparalleled. They didn't just find us a house; they found us a home that reflects our soul.",
    author: 'Eleanor Vance',
    location: 'Purchased in Malibu, CA',
    image: 'testimonial-1',
    rating: 5,
  },
  {
    quote: "The level of professionalism and market insight provided by the Monks team is in a league of its own. They handled every aspect of our sale with grace and efficiency, exceeding all expectations.",
    author: 'Julian Thorne',
    location: 'Sold in SoHo, NYC',
    image: 'testimonial-2',
    rating: 5,
  },
  {
    quote: "From the initial consultation to the final closing, the experience was seamless. Their expertise in minimalist design aesthetics is truly impressive. Highly recommended for the discerning buyer.",
    author: "Sofia Chen",
    location: "Purchased in Kyoto, Japan",
    image: "avatar-3",
    rating: 5,
  },
  {
    quote: "They transformed our property selling experience into a stress-free journey. Their innovative marketing and deep understanding of the luxury market were key to our success.",
    author: "David Lee",
    location: "Sold in Aspen, CO",
    image: "founder-photo",
    rating: 5,
  }
];


