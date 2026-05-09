
import { prefixAgencyPath } from './agency-routing';

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

function withAgencyPath(agencySlug?: string | null, href?: string) {
  return href ? prefixAgencyPath(href, agencySlug) : href;
}

export function getNavConfig(agencySlug?: string | null): NavConfig {
  return [
  {
    label: 'New Projects',
    href: withAgencyPath(agencySlug, '/off-plan'),
  },
  {
    label: 'Buy',
    dropdown: [
      {
        header: 'Residential',
        links: [
          { label: 'Apartments', href: withAgencyPath(agencySlug, '/properties?type=buy&propertyType=Apartment')! },
          { label: 'Townhouses', href: withAgencyPath(agencySlug, '/properties?type=buy&propertyType=Townhouse')! },
          { label: 'Penthouses', href: withAgencyPath(agencySlug, '/properties?type=buy&propertyType=Penthouse')! },
          { label: 'Villas', href: withAgencyPath(agencySlug, '/properties?type=buy&propertyType=Villa')! },
          { label: 'View All', href: withAgencyPath(agencySlug, '/properties?type=buy')! },
        ],
      },
      {
        header: 'Off Plan',
        links: [
          { label: 'Apartments', href: withAgencyPath(agencySlug, '/off-plan')! },
          { label: 'Townhouses', href: withAgencyPath(agencySlug, '/off-plan')! },
          { label: 'Penthouses', href: withAgencyPath(agencySlug, '/off-plan')! },
          { label: 'Villas', href: withAgencyPath(agencySlug, '/off-plan')! },
          { label: 'View All', href: withAgencyPath(agencySlug, '/off-plan')! },
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
                { label: 'Apartments', href: withAgencyPath(agencySlug, '/properties?type=rent')! },
                { label: 'Offices', href: withAgencyPath(agencySlug, '/properties?type=rent')! },
                { label: 'Townhouses', href: withAgencyPath(agencySlug, '/properties?type=rent')! },
            ],
        },
        {
            header: '',
            links: [
                { label: 'Villas', href: withAgencyPath(agencySlug, '/properties?type=rent')! },
                { label: 'Commercial', href: withAgencyPath(agencySlug, '/properties?type=rent')! },
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
          { label: 'Offices for Sale', href: withAgencyPath(agencySlug, '/properties?type=buy&propertyType=Office')! },
          { label: 'Shops for Sale', href: withAgencyPath(agencySlug, '/properties?type=buy&propertyType=Retail')! },
          { label: 'Warehouses for Sale', href: withAgencyPath(agencySlug, '/properties?type=buy&propertyType=Warehouse')! },
          { label: 'Full Buildings for Sale', href: withAgencyPath(agencySlug, '/properties?type=buy&propertyType=Building')! },
          { label: 'Plots for Sale', href: withAgencyPath(agencySlug, '/properties?type=buy&propertyType=Land')! },
          { label: 'View All Commercial', href: withAgencyPath(agencySlug, '/properties?category=commercial')! },
        ]
      },
      {
        header: 'Leasing',
        links: [
          { label: 'Offices for Rent', href: withAgencyPath(agencySlug, '/properties?type=rent&propertyType=Office')! },
          { label: 'Shops for Rent', href: withAgencyPath(agencySlug, '/properties?type=rent&propertyType=Retail')! },
          { label: 'Warehouses for Rent', href: withAgencyPath(agencySlug, '/properties?type=rent&propertyType=Warehouse')! },
          { label: 'Staff Accommodation', href: withAgencyPath(agencySlug, '/properties?type=rent&propertyType=StaffAccommodation')! },
        ]
      },
    ]
  },
  {
    label: 'Sell',
    href: withAgencyPath(agencySlug, '/sell'),
  },
  {
    label: 'Services',
    dropdown: [
      {
        header: 'Client Services',
        links: [
            { label: 'Asset Management', href: withAgencyPath(agencySlug, '/services/asset-management')! },
            { label: 'Holiday Homes', href: withAgencyPath(agencySlug, '/services/holiday-homes')! },
            { label: 'List Your Property', href: withAgencyPath(agencySlug, '/sell')! },
            { label: 'Property Valuation', href: withAgencyPath(agencySlug, '/services/property-valuation')! },
        ]
      },
      {
        header: 'Advisory',
        links: [
            { label: 'Investment Advisory', href: withAgencyPath(agencySlug, '/services/investment-advisory')! },
            { label: 'Mortgage Advisory', href: withAgencyPath(agencySlug, '/services/mortgage-advisory')! },
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
          { label: 'Emaar', href: withAgencyPath(agencySlug, '/developers/emaar')! },
          { label: 'Nakheel', href: withAgencyPath(agencySlug, '/developers/nakheel')! },
          { label: 'Danube', href: withAgencyPath(agencySlug, '/developers/danube')! },
        ],
      },
      {
        header: '',
        links: [
          { label: 'Select Group', href: withAgencyPath(agencySlug, '/developers/select-group')! },
          { label: 'View All Developers', href: withAgencyPath(agencySlug, '/developers')! },
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
          { label: 'About', href: withAgencyPath(agencySlug, '/about')! },
          { label: 'Agents', href: withAgencyPath(agencySlug, '/agents')! },
          { label: 'Contact', href: withAgencyPath(agencySlug, '/contact')! },
          { label: 'Map', href: withAgencyPath(agencySlug, '/map')! },
        ],
      },
    ],
  },
  ];
}

export const navConfig: NavConfig = getNavConfig();
