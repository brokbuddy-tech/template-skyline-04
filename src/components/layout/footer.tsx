import Link from 'next/link';
import { CurrencySwitcher } from '../shared/currency-switcher';
import { AnimateOnScroll } from '../animate-on-scroll';

export function Footer() {
  const navLinks = [
    { href: '/properties?type=rent', label: 'Rent' },
    { href: '/properties?type=buy', label: 'Buy' },
    { href: '/properties?type=sell', label: 'Sell' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/map', label: 'Map' },
  ];

  const socialLinks = [
    { href: '#', label: 'Instagram' },
    { href: '#', label: 'X (Twitter)' },
    { href: '#', label: 'LinkedIn' },
    { href: '#', label: 'Facebook' },
  ];

  return (
    <footer id="main-footer" className="relative min-h-screen w-full bg-primary text-primary-foreground flex flex-col justify-between p-8 sm:p-16">
      <div className="flex-grow flex items-center">
        <div className="w-full">
          <AnimateOnScroll className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
              <div className="md:col-span-5">
                <h2 className="font-headline text-5xl md:text-7xl lg:text-8xl tracking-tighter">
                  Let&apos;s find your next place.
                </h2>
              </div>

              <div className="md:col-span-1"></div>

              <div className="md:col-span-2">
                <h3 className="font-body text-sm uppercase tracking-widest text-muted-foreground mb-4">
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
                <h3 className="font-body text-sm uppercase tracking-widest text-muted-foreground mb-4">
                  Social
                </h3>
                <ul className="space-y-2">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-lg hover:underline">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-body text-sm uppercase tracking-widest text-muted-foreground mb-4">
                  Settings
                </h3>
                <CurrencySwitcher />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
      <AnimateOnScroll className="space-y-8">
        <div className="text-center text-muted-foreground text-sm font-body">
          <p>&copy; {new Date().getFullYear()} Monks Estate Pro. All Rights Reserved.</p>
        </div>
      </AnimateOnScroll>
    </footer>
  );
}
