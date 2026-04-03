import Link from 'next/link';
import { getSiteConfig, toSocialUrl } from '@/lib/api';
import { AnimateOnScroll } from '../animate-on-scroll';

export async function Footer() {
  const siteConfig = await getSiteConfig();
  const displayName =
    siteConfig.branding?.displayName || siteConfig.organization.name || 'SkyLines';
  const navLinks = [
    { href: '/properties?type=buy', label: 'Buy' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/map', label: 'Map' },
  ];

  const socialLinks = [
    { href: toSocialUrl('instagram', siteConfig.branding?.instagram), label: 'Instagram' },
    { href: toSocialUrl('twitter', siteConfig.branding?.twitter), label: 'X (Twitter)' },
    { href: toSocialUrl('linkedin', siteConfig.branding?.linkedin), label: 'LinkedIn' },
    { href: toSocialUrl('whatsapp', siteConfig.branding?.whatsapp), label: 'WhatsApp' },
  ].filter((link): link is { href: string; label: string } => Boolean(link.href));

  return (
    <footer id="main-footer" className="relative min-h-screen w-full bg-primary text-primary-foreground dark:bg-accent dark:text-accent-foreground flex flex-col justify-between p-8 sm:p-16">
      <div className="flex-grow flex items-center">
        <div className="w-full">
          <AnimateOnScroll className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
              <div className="md:col-span-5">
                <h2 className="font-headline text-5xl md:text-7xl lg:text-8xl tracking-tighter">
                  Let&apos;s find your next place.
                </h2>
              </div>

              <div className="md:col-span-3"></div>

              <div className="md:col-span-2">
                <h3 className="font-body text-sm uppercase tracking-widest text-white dark:text-accent-foreground mb-4">
                  Navigation
                </h3>
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-lg hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-body text-sm uppercase tracking-widest text-white dark:text-accent-foreground mb-4">
                  Social
                </h3>
                <ul className="space-y-2">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-lg hover:underline" target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
      <AnimateOnScroll className="space-y-8">
        <div className="flex justify-between items-center text-sm font-body">
          <p className="text-white dark:text-accent-foreground">&copy; {new Date().getFullYear()} {displayName}. All Rights Reserved.</p>
        </div>
      </AnimateOnScroll>
    </footer>
  );
}
