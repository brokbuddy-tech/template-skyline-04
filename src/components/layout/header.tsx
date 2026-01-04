'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '../logo';
import { MobileNav } from './mobile-nav';
import { CurrencySwitcher } from '../shared/currency-switcher';
import { ThemeSwitch } from '../shared/theme-switch';
import { navConfig } from '@/lib/nav-config';
import { MegaMenu } from './mega-menu';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 w-full bg-white/95 border-b border-gray-100 h-[80px] flex items-center justify-between px-8 z-50 transition-all duration-300',
        isScrolled && 'shadow-sm backdrop-blur-md'
      )}
    >
      <div className="flex items-center">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <nav className="hidden lg:flex items-center justify-center flex-1">
        <MegaMenu navConfig={navConfig} />
      </nav>

      <div className="hidden lg:flex items-center gap-4">
        <ThemeSwitch />
        <CurrencySwitcher />
        <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
          <Link href="/properties">Book Now</Link>
        </Button>
      </div>

      <div className="lg:hidden flex items-center gap-4">
        <CurrencySwitcher />
        <MobileNav navLinks={navConfig} />
      </div>
    </header>
  );
}
