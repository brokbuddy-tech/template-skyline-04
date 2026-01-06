
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '../logo';
import { MobileNav } from './mobile-nav';
import { CurrencySwitcher } from '../shared/currency-switcher';
import { navConfig } from '@/lib/nav-config';
import { MegaMenu } from './mega-menu';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ThemeSwitch } from '../shared/theme-switch';

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
        'sticky top-0 w-full bg-white/95 dark:bg-black/95 border-b border-gray-100 dark:border-gray-800 h-[80px] flex items-center justify-between px-4 sm:px-8 z-40 transition-all duration-300',
        isScrolled && 'shadow-sm backdrop-blur-md'
      )}
    >
      <div className="flex items-center flex-shrink-0">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <nav className="hidden lg:flex items-center justify-center flex-1 min-w-0">
        <MegaMenu navConfig={navConfig} />
      </nav>

      <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
        <CurrencySwitcher />
        <ThemeSwitch />
      </div>

      <div className="lg:hidden flex items-center gap-4">
        <CurrencySwitcher />
      </div>
    </header>
  );
}
