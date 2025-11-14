'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeSwitch } from '../shared/theme-switch';
import { CurrencySwitcher } from '../shared/currency-switcher';

type NavLink = {
  href: string;
  label: string;
};

export function MobileNav({ navLinks }: { navLinks: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <label className="hamburger">
        <input type="checkbox" checked={isOpen} onChange={() => setIsOpen(!isOpen)} />
        <svg viewBox="0 0 32 32">
          <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" />
          <path className="line" d="M7 16 27 16" />
        </svg>
      </label>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-background transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="container mx-auto flex flex-col items-center justify-between h-full py-20">
          <nav className="flex flex-col items-center gap-8 text-center mt-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-3xl font-headline font-medium transition-colors hover:text-accent"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-8">
            <Button
              variant="default"
              size="lg"
              asChild
              onClick={() => setIsOpen(false)}
            >
              <Link href="/properties">Book Now</Link>
            </Button>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </div>
  );
}
