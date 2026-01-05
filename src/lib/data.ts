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

export const properties: Property[] = [
  {
    id: '1',
    title: 'The Glass House',
    location: 'Malibu, California',
    price: 3500000,
    bedrooms: 4,
    bathrooms: 5,
    sqft: 4200,
    type: 'House',
    amenities: ['Pool', 'Ocean View', 'Private Gym', 'Home Theater', 'Wine Cellar'],
    images: ['prop-1-1', 'prop-1-2', 'prop-1-3'],
    description: "Perched atop a Malibu cliffside, The Glass House offers breathtaking panoramic ocean views through its floor-to-ceiling windows. This architectural marvel blends minimalist design with luxurious comfort. Featuring an infinity pool that merges with the horizon, a state-of-the-art home theater, and a curated wine cellar, it's an entertainer's dream. The master suite provides a serene escape with its private balcony and spa-like bathroom. Experience coastal living at its absolute finest.",
    referenceId: 'MB-GH-42',
    trakheesi: '123456789',
    reraPermit: '987654321',
    featured: true,
    status: 'Ready',
    photoCount: 12,
  },
  {
    id: '2',
    title: 'Urban Oasis Loft',
    location: 'SoHo, New York',
    price: 2750000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 2100,
    type: 'Apartment',
    amenities: ['Rooftop Terrace', 'Concierge', 'Exposed Brick', 'Chef\'s Kitchen'],
    images: ['prop-2-1'],
    description: 'Located in the heart of SoHo, this exquisite loft is a testament to timeless design. Exposed brick walls and original hardwood floors meet modern luxury in a spacious, open-concept layout. The chef\'s kitchen is equipped with top-of-the-line appliances, perfect for culinary explorations. A private rooftop terrace offers a rare, tranquil escape amidst the city buzz. With a 24/7 concierge service, every need is catered to in this urban sanctuary.',
    referenceId: 'NY-UO-21',
    status: 'Ready',
    photoCount: 8,
  },
  {
    id: '3',
    title: 'The Evergreen Manor',
    location: 'Aspen, Colorado',
    price: 6200000,
    bedrooms: 6,
    bathrooms: 7,
    sqft: 8500,
    type: 'House',
    amenities: ['Ski-in/Ski-out', 'Hot Tub', 'Mountain View', 'Sauna', 'Game Room'],
    images: ['prop-3-1'],
    description: 'The Evergreen Manor is the epitome of mountain luxury. With direct ski-in/ski-out access to Aspen\'s world-renowned slopes, this estate is a winter sports enthusiast\'s paradise. After a day on the mountain, unwind in the outdoor hot tub or indoor sauna, all while enjoying stunning, unobstructed mountain views. The interior boasts a grand fireplace, a professional-grade kitchen, and a cozy game room for endless entertainment. This is more than a home; it\'s a legacy.',
    referenceId: 'AS-EM-85',
    featured: true,
    status: 'Ready',
    photoCount: 25,
  },
  {
    id: '4',
    title: 'Penthouse Panorama',
    location: 'Downtown, Dubai',
    price: 4100000,
    bedrooms: 3,
    bathrooms: 4,
    sqft: 3500,
    type: 'Penthouse',
    amenities: ['360° City View', 'Private Pool', 'Smart Home', '24/7 Security'],
    images: ['prop-4-1'],
    description: 'Commanding the entire top floor, Penthouse Panorama offers an unparalleled 360-degree view of the iconic Dubai skyline. This residence is the pinnacle of modern technology, with a fully integrated smart home system controlling everything from lighting to climate. The expansive terrace features a private infinity pool, creating a spectacular illusion of swimming in the sky. Every detail has been meticulously crafted for a life of effortless elegance and security.',
    referenceId: 'DB-PP-35',
    trakheesi: '987654321',
    reraPermit: '123456789',
    status: 'Ready',
    photoCount: 18,
  },
  {
    id: '5',
    title: 'The Coastal Retreat',
    location: 'Byron Bay, Australia',
    price: 2900000,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3800,
    type: 'House',
    amenities: ['Beach Access', 'Yoga Deck', 'Outdoor Kitchen', 'Surfboard Storage'],
    images: ['prop-5-1'],
    description: 'Embrace the laid-back luxury of Byron Bay in this stunning coastal retreat. With private access to a secluded beach, this home is a sanctuary of peace and natural beauty. The open-plan living area flows seamlessly to an expansive yoga deck and outdoor kitchen, perfect for alfresco living. Designed with natural materials and a neutral palette, the home creates a tranquil atmosphere that calms the soul. It\'s the perfect base to explore the vibrant culture and pristine nature of the region.',
    referenceId: 'AU-CR-38',
    status: 'Ready',
    photoCount: 15,
  },
  {
    id: '6',
    title: 'The Minimalist Villa',
    location: 'Kyoto, Japan',
    price: 3800000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 3100,
    type: 'House',
    amenities: ['Zen Garden', 'Tea Room', 'Hinoki Bath', 'Heated Floors'],
    images: ['prop-6-1'],
    description: 'Inspired by traditional Japanese aesthetics, this minimalist villa is a masterpiece of design and tranquility. A private zen garden provides a serene backdrop to the clean, uncluttered interiors. The home features a dedicated tea room for quiet contemplation and a luxurious Hinoki wood bath for ultimate relaxation. Natural light floods the space, highlighting the beauty of the carefully selected materials. This is a home designed for mindfulness and a deep connection to its surroundings.',
    referenceId: 'KY-MV-31',
    featured: true,
    status: 'Ready',
    photoCount: 22,
  },
    {
    id: '7',
    title: 'The Parisian Apartment',
    location: 'Paris, France',
    price: 1800000,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1200,
    type: 'Apartment',
    amenities: ['Rooftop Terrace', 'Concierge', 'Exposed Brick', 'Chef\'s Kitchen'],
    images: ['prop-7-1'],
    description: 'This charming Parisian apartment is located in the heart of Le Marais. It features a beautiful rooftop terrace with stunning views of the city. The interior has been recently renovated with a modern kitchen and bathroom, but still retains its classic Parisian charm with exposed brick walls and hardwood floors.',
    referenceId: 'PA-PA-12',
    status: 'Ready',
    photoCount: 9,
  },
  {
    id: '8',
    title: 'The Countryside Estate',
    location: 'Tuscany, Italy',
    price: 5500000,
    bedrooms: 7,
    bathrooms: 8,
    sqft: 10000,
    type: 'House',
    amenities: ['Pool', 'Mountain View', 'Wine Cellar', 'Game Room'],
    images: ['prop-8-1'],
    description: 'This magnificent estate is located in the rolling hills of Tuscany. It features a large swimming pool, a private vineyard, and breathtaking views of the surrounding countryside. The interior is spacious and luxurious, with 7 bedrooms, 8 bathrooms, a game room, and a wine cellar. This is the perfect place to relax and enjoy the Italian lifestyle.',
    referenceId: 'IT-CE-100',
    status: 'Ready',
    photoCount: 30,
  },
  {
    id: '9',
    title: 'Seaside Serenity | Emaar',
    location: 'Mina Rashid, Dubai',
    price: 2595000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1328,
    type: 'Apartment',
    amenities: ['Pool', 'Ocean View', 'Private Gym'],
    images: ['prop-1-1'],
    description: `**Project Overview:**
"Lyvia by Palace is a 50-story architectural masterpiece situated in the prestigious Green Gate district. Designed by Emaar in collaboration with Palace Hospitality, it offers expansive floor-to-ceiling windows that frame sweeping views of the Creek and Dubai skyline."

**The Lifestyle:**
"Residents enjoy a unique 'resort-style' living experience with direct access to the Creek Beach and Marina. The interiors boast modern kitchens with premium finishes, fluid open-plan layouts, and private balconies that blend indoor luxury with outdoor serenity."

**Key Specifications:**
- **Property Type:** Luxury Apartments & Townhouses
- **Unit Configs:** 1, 2, 3 Bedroom Apts & 3 Bed Townhouses
- **Payment Plan:** 80/20 (10% Down, 70% Construction, 20% Handover)
- **Ownership:** Freehold
- **Total Units:** 478 Units (50-Story Tower)

**Unit Configuration Table:**
- **1 Bedroom:** 1 Bath, 760 – 1,417 sq.ft, Starting at AED 1.98M
- **2 Bedroom:** 2 Bath, 1,144 – 1,916 sq.ft, Starting at AED 3.1M
- **3 Bedroom:** 4 Bath, 1,821 – 1,835 sq.ft, Starting at AED 4.5M
- **Townhouse:** 3 Bed + Maid, ~3,238 sq.ft, On Request

**Amenities & Lifestyle:**
- **Wellness & Fitness:** Infinity Lap Pool & Rooftop Terraces, Cutting-edge Gym & Wellness Spaces, Sports Courts & Jogging Tracks
- **Community & Leisure:** Landscaped Gardens & Pocket Parks, Children's Play Areas (Indoor/Outdoor), Direct Marina/Waterfront Access
- **Palace Hospitality Services:** Exclusive Concierge Support, 24/7 Security & Valet

**Payment Plan Breakdown:**
- **10%** – Down Payment (Immediate / Booking)
- **70%** – During Construction (7 Installments)
- **20%** – On Handover (July 2029)

**Location & Connectivity:**
- **Neighborhood:** Green Gate District, Dubai Creek Harbour.
- **Nearby Landmarks:** 10 Mins to Downtown Dubai / Burj Khalifa, 15 Mins to Dubai International Airport (DXB), 20 Mins to Business Bay & DIFC. Direct Access to Creek Marina & Water Taxi Stations.`,
    status: 'Off-plan',
    photoCount: 5,
    tag: 'Residential',
    developerLogo: 'Emaar',
  },
  {
    id: '10',
    title: 'Palm Jumeirah Villa | Nakheel',
    location: 'Palm Jumeirah, Dubai',
    price: 12500000,
    bedrooms: 5,
    bathrooms: 6,
    sqft: 5500,
    type: 'Villa',
    amenities: ['Private Pool', 'Beach Access', 'Smart Home'],
    images: [],
    description: `**Project Overview:**
"A beachfront villa by Nakheel, offering a premium blend of contemporary design and urban sophistication rising above the Arabian Gulf. Designed in collaboration with world-renowned architects, it offers expansive floor-to-ceiling windows that frame sweeping views of the sea and Dubai skyline."

**The Lifestyle:**
"Residents enjoy a unique 'resort-style' living experience with direct access to a private beach. The interiors boast modern kitchens with premium finishes, fluid open-plan layouts, and private terraces that blend indoor luxury with outdoor serenity."

**Key Specifications:**
- **Property Type:** Luxury Villa
- **Unit Configs:** 5 Bedroom Villa
- **Payment Plan:** 60/40 (10% Down, 50% Construction, 40% Handover)
- **Ownership:** Freehold
- **Handover:** Q2 2027

**Amenities & Lifestyle:**
- **Wellness & Fitness:** Private Infinity Pool, State-of-the-art Gym
- **Community & Leisure:** Private Beach Access, Landscaped Gardens
- **Services:** Exclusive Concierge Support, 24/7 Security & Valet

**Payment Plan Breakdown:**
- **10%** – Down Payment (Immediate / Booking)
- **50%** – During Construction (5 Installments)
- **40%** – On Handover (Q2 2027)

**Location & Connectivity:**
- **Neighborhood:** Palm Jumeirah.
- **Nearby Landmarks:** 15 Mins to Dubai Marina, 25 Mins to Downtown Dubai / Burj Khalifa, 30 Mins to Dubai International Airport (DXB).`,
    status: 'Off-plan',
    photoCount: 10,
    tag: 'Residential',
    developerLogo: 'Nakheel',
  },
  {
    id: '11',
    title: 'Downtown Views II | Emaar',
    location: 'Downtown Dubai',
    price: 3200000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1800,
    type: 'Apartment',
    amenities: ['360° City View', 'Concierge', 'Pool'],
    images: ['prop-4-1'],
    description: `**Project Overview:**
"Downtown Views II is a 55-story architectural masterpiece situated in the prestigious Downtown Dubai. Designed by Emaar, it offers expansive floor-to-ceiling windows that frame sweeping views of the Burj Khalifa and Dubai skyline."

**The Lifestyle:**
"Residents enjoy a unique 'urban-style' living experience with direct access to The Dubai Mall. The interiors boast modern kitchens with premium finishes, fluid open-plan layouts, and private balconies that blend indoor luxury with outdoor serenity."

**Key Specifications:**
- **Property Type:** Luxury Apartments
- **Unit Configs:** 1, 2, 3 Bedroom Apartments
- **Payment Plan:** 70/30 (10% Down, 60% Construction, 30% Handover)
- **Ownership:** Freehold
- **Handover:** Q4 2026

**Unit Configuration Table:**
- **1 Bedroom:** 1 Bath, 700 – 900 sq.ft, Starting at AED 1.5M
- **2 Bedroom:** 2 Bath, 1,100 – 1,500 sq.ft, Starting at AED 2.5M
- **3 Bedroom:** 3 Bath, 1,600 – 2,000 sq.ft, Starting at AED 4.0M

**Amenities & Lifestyle:**
- **Wellness & Fitness:** Infinity Pool, State-of-the-art Gym
- **Community & Leisure:** Direct Mall Access, Children's Play Areas
- **Services:** Exclusive Concierge Support, 24/7 Security

**Payment Plan Breakdown:**
- **10%** – Down Payment (Immediate / Booking)
- **60%** – During Construction (6 Installments)
- **30%** – On Handover (Q4 2026)

**Location & Connectivity:**
- **Neighborhood:** Downtown Dubai.
- **Nearby Landmarks:** 2 Mins to The Dubai Mall / Burj Khalifa, 15 Mins to Dubai International Airport (DXB), 20 Mins to Dubai Marina. Direct Access to the Metro.`,
    status: 'Off-plan',
    photoCount: 8,
    tag: 'Residential',
    developerLogo: 'Emaar',
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
