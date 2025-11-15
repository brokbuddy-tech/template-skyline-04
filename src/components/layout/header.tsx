'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Logo } from '../logo';
import { MobileNav } from './mobile-nav';
import { CurrencySwitcher } from '../shared/currency-switcher';
import { ThemeSwitch } from '../shared/theme-switch';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/map', label: 'Map' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-background transition-shadow duration-300',
        isScrolled ? 'shadow-sm border-b' : 'border-b border-transparent'
      )}
      style={{ borderColor: isScrolled ? '#EAEAEA' : 'transparent' }}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-8">
        <div className="flex items-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent',
                pathname === link.href ? 'text-primary' : 'text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitch />
          <CurrencySwitcher />
          <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
            <Link href="/properties">Book Now</Link>
          </Button>
        </div>
        <div className="md:hidden flex items-center gap-4">
          <CurrencySwitcher />
          <MobileNav navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
