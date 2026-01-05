
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
    description: `### Lyvia by Palace: Where Urban Sophistication Meets Waterfront Serenity

Rising elegantly above the shimmering waters of Dubai Creek Harbour, Lyvia by Palace represents the pinnacle of branded waterfront living. Developed by the legendary Emaar Properties in an exclusive collaboration with Palace Hospitality, this 50-story architectural masterpiece offers a curated lifestyle that blends resort-style indulgence with seamless urban connectivity. Arrive home to a statement of prestige, where every detail is crafted for an extraordinary life.

### The Residence: A Sanctuary of Light and Space

Every residence at Lyvia is a sanctuary of light and space. With expansive floor-to-ceiling windows, homes are bathed in natural light, offering breathtaking, panoramic vistas of the Creek Marina and the iconic Dubai skyline. The interiors feature fluid, open-plan layouts with bespoke finishes and premium materials, creating an atmosphere of understated elegance. Private balconies and terraces seamlessly extend your living space, blurring the line between indoor luxury and the stunning beauty of the outdoors.

### The Lifestyle: A World of Unparalleled Amenities

The lifestyle at Lyvia is a testament to the art of fine living, curated by Palace Hospitality. 
*   **Wellness & Fitness:** Start your day with an invigorating swim in the magnificent infinity lap pool, unwind on the serene rooftop terraces, or pursue your fitness goals in the cutting-edge gym and dedicated wellness spaces.
*   **Community & Leisure:** Stroll through beautifully landscaped gardens and pocket parks, watch your children delight in the indoor and outdoor play areas, or enjoy an afternoon barbecue. With direct access to the marina and waterfront promenade, your leisure options are as endless as the views.
*   **Palace Hospitality Services:** Experience a life of effortless comfort with exclusive concierge support, 24/7 security, and convenient valet services, ensuring every need is met with impeccable attention.

### The Investment: Strategic Location & Lasting Value

Strategically located in the high-growth Green Gate district of Dubai Creek Harbour, Lyvia offers unparalleled connectivity and significant investment potential. This prime location places you just minutes from Dubai's key destinations:
*   **10 Mins** to Downtown Dubai & The Burj Khalifa
*   **15 Mins** to Dubai International Airport (DXB)
*   **20 Mins** to Business Bay & DIFC

With a flexible 80/20 payment plan and the backing of Emaar's proven track record, Lyvia is not just a home—it is a secure and valuable asset in one of the world's most dynamic cities. Secure your future in Dubai's next iconic landmark.`,
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
    description: `### Beachfront Majesty: The Palm Jumeirah Signature Villa by Nakheel

Introducing an exclusive offering from Nakheel on the iconic Palm Jumeirah—a beachfront villa where architectural brilliance meets the tranquil rhythm of the Arabian Gulf. Designed for the discerning few, this residence offers a premium blend of contemporary design and urban sophistication, providing an unparalleled sanctuary with direct access to your private stretch of pristine sand.

### The Residence: Exquisite Interiors with Boundless Horizons

Step into a world of refined luxury. Every detail of this 5-bedroom villa is crafted to perfection, from the fluid open-plan layouts to the premium finishes in the state-of-the-art kitchen. Expansive floor-to-ceiling windows frame sweeping, unobstructed views of the sea and the glittering Dubai skyline, while private terraces create a seamless connection between the exquisite interiors and the serene beachfront environment. This is a home designed not just for living, but for experiencing.

### The Lifestyle: Your Private Resort-Style Escape

Embrace a lifestyle of ultimate relaxation and privacy.
*   **Wellness:** Begin your mornings with a dip in your private infinity pool, a workout in the state-of-the-art gym, or a stroll along your exclusive beach.
*   **Entertaining:** Host unforgettable gatherings in your landscaped garden or spacious terrace, with the stunning backdrop of the Arabian Gulf.
*   **Service:** Enjoy peace of mind with 24/7 security and access to exclusive concierge support, ensuring a life of effortless comfort and convenience.

### The Investment: A Trophy Asset in a World-Class Location

Owning a villa on the Palm Jumeirah is an investment in a global landmark. This prestigious address offers both an exceptional lifestyle and a robust potential for capital appreciation, backed by Nakheel's legacy of creating iconic communities. The flexible 60/40 payment plan makes securing this trophy asset more attainable.
*   **15 Mins** to Dubai Marina
*   **25 Mins** to Downtown Dubai / Burj Khalifa
*   **30 Mins** to Dubai International Airport (DXB)

Don't miss this rare opportunity to own a piece of paradise. Register your interest today to receive the exclusive brochure and floor plans.`,
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
    description: `### Downtown Views II: Live Above it All in the Heart of Dubai

Experience the pinnacle of urban living at Downtown Views II, a 55-story tower by Emaar that offers a front-row seat to the most iconic skyline in the world. Situated in the prestigious Downtown Dubai, this is where luxury, convenience, and breathtaking views converge. With direct access to The Dubai Mall, you are seamlessly connected to world-class retail, dining, and entertainment.

### The Residence: Sophisticated Design with Iconic Vistas

Each apartment at Downtown Views II is a masterclass in modern design. The expansive floor-to-ceiling windows don't just illuminate the space—they frame postcard-perfect views of the Burj Khalifa and the vibrant cityscape. The interiors are defined by fluid open-plan layouts, modern kitchens with premium finishes, and private balconies that allow you to step out and soak in the energy of Downtown Dubai.

### The Lifestyle: An Extension of the World's Most Exciting Neighborhood

Your life at Downtown Views II is complemented by a suite of world-class amenities designed for relaxation and recreation.
*   **Wellness:** Rejuvenate in the stunning temperature-controlled infinity pool or maintain your fitness regime in the state-of-the-art gym.
*   **Family & Leisure:** With direct, air-conditioned access to The Dubai Mall and dedicated children's play areas, every member of the family is catered for.
*   **Convenience:** Enjoy the peace of mind that comes with 24/7 security and exclusive concierge services, ready to assist with your every need.

### The Investment: A Prime Asset with Unbeatable Connectivity

Investing in Downtown Views II means securing a property in one of the most sought-after locations globally. This address guarantees high rental demand and strong potential for capital appreciation. The flexible 70/30 payment plan enhances its investment appeal.
*   **2 Mins** to The Dubai Mall & Burj Khalifa
*   **15 Mins** to Dubai International Airport (DXB)
*   **20 Mins** to Dubai Marina
*   **Direct Access** to the Dubai Metro

Secure your place in the center of now. Contact us to learn more about this exceptional investment and lifestyle opportunity.`,
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

    
