
export type NavLink = {
  label: string;
  href: string;
};

export type DropdownColumn = {
  header: string;
  links: NavLink[];
};

export type NavItem = {
  label: string;
  href?: string;
  dropdown?: DropdownColumn[];
};

export type NavConfig = NavItem[];

export const navConfig: NavConfig = [
  {
    label: 'New Projects',
    href: '/off-plan',
  },
  {
    label: 'Buy',
    dropdown: [
      {
        header: 'Residential',
        links: [
          { label: 'Apartments', href: '/properties?type=buy&propertyType=Apartment' },
          { label: 'Townhouses', href: '/properties?type=buy&propertyType=Townhouse' },
          { label: 'Penthouses', href: '/properties?type=buy&propertyType=Penthouse' },
          { label: 'Villas', href: '/properties?type=buy&propertyType=Villa' },
          { label: 'View All', href: '/properties?type=buy' },
        ],
      },
      {
        header: 'Off Plan',
        links: [
          { label: 'Apartments', href: '/off-plan' },
          { label: 'Townhouses', href: '/off-plan' },
          { label: 'Penthouses', href: '/off-plan' },
          { label: 'Villas', href: '/off-plan' },
          { label: 'View All', href: '/off-plan' },
        ],
      },
    ],
  },
  {
    label: 'Rent',
    dropdown: [
        {
            header: 'Rent',
            links: [
                { label: 'Apartments', href: '/properties?type=rent' },
                { label: 'Offices', href: '/properties?type=rent' },
                { label: 'Townhouses', href: '/properties?type=rent' },
            ],
        },
        {
            header: '',
            links: [
                { label: 'Villas', href: '/properties?type=rent' },
                { label: 'Commercial', href: '/properties?type=rent' },
            ]
        }
    ]
  },
  {
    label: 'Commercial',
    dropdown: [
      {
        header: 'Sales',
        links: [
          { label: 'Offices for Sale', href: '/properties?type=buy&propertyType=Office' },
          { label: 'Shops for Sale', href: '/properties?type=buy&propertyType=Retail' },
          { label: 'Warehouses for Sale', href: '/properties?type=buy&propertyType=Warehouse' },
          { label: 'Full Buildings for Sale', href: '/properties?type=buy&propertyType=Building' },
          { label: 'Plots for Sale', href: '/properties?type=buy&propertyType=Land' },
          { label: 'View All Commercial', href: '/properties?category=commercial' },
        ]
      },
      {
        header: 'Leasing',
        links: [
          { label: 'Offices for Rent', href: '/properties?type=rent&propertyType=Office' },
          { label: 'Shops for Rent', href: '/properties?type=rent&propertyType=Retail' },
          { label: 'Warehouses for Rent', href: '/properties?type=rent&propertyType=Warehouse' },
          { label: 'Staff Accommodation', href: '/properties?type=rent&propertyType=StaffAccommodation' },
        ]
      },
    ]
  },
  {
    label: 'Sell',
    href: '/sell',
  },
  {
    label: 'Services',
    dropdown: [
      {
        header: 'Client Services',
        links: [
            { label: 'Asset Management', href: '/services/asset-management' },
            { label: 'Holiday Homes', href: '/services/holiday-homes' },
            { label: 'List Your Property', href: '/services/list-your-property' },
            { label: 'Property Valuation', href: '/services/property-valuation' },
        ]
      },
      {
        header: 'Advisory',
        links: [
            { label: 'Investment Advisory', href: '/services/investment-advisory' },
            { label: 'Mortgage Advisory', href: '/services/mortgage-advisory' },
        ]
      }
    ]
  },
  {
    label: 'Explore',
    dropdown: [
      {
        header: 'Developers',
        links: [
          { label: 'Emaar', href: '/developers/emaar' },
          { label: 'Nakheel', href: '/developers/nakheel' },
          { label: 'Danube', href: '/developers/danube' },
        ],
      },
      {
        header: '',
        links: [
          { label: 'Select Group', href: '/developers/select-group' },
          { label: 'View All Developers', href: '/developers' },
        ],
      },
    ],
  },
  {
    label: 'More',
    dropdown: [
      {
        header: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Map', href: '/map' },
        ],
      },
    ],
  },
];
