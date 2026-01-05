
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
          { label: 'Apartments', href: '/buy/residential/apartments' },
          { label: 'Townhouses', href: '/buy/residential/townhouses' },
          { label: 'Penthouses', href: '/buy/residential/penthouses' },
          { label: 'Villas', href: '/buy/residential/villas' },
          { label: 'View All', href: '/buy/residential' },
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
      {
        header: 'Commercial',
        links: [
          { label: 'Offices', href: '/buy/commercial/offices' },
          { label: 'View All', href: '/buy/commercial' },
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
                { label: 'Apartments', href: '/rent/apartments' },
                { label: 'Offices', href: '/rent/offices' },
                { label: 'Townhouses', href: '/rent/townhouses' },
            ],
        },
        {
            header: '',
            links: [
                { label: 'Villas', href: '/rent/villas' },
                { label: 'Commercial', href: '/rent/commercial' },
            ]
        }
    ]
  },
  {
    label: 'Commercial',
    href: '/commercial'
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
            { label: 'Luxury Portfolio', href: '/services/luxury' },
            { label: 'Commercial Sales', href: '/services/commercial' },
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
