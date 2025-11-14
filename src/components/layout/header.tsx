'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '../theme-toggle';

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
    { href: '/properties?type=rent', label: 'Rent' },
    { href: '/properties?type=buy',label: 'Buy' },
    { href: '/properties?type=sell',label: 'Sell' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/map', label: 'Map' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-background transition-all duration-300',
        isScrolled ? 'border-b' : 'border-b border-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-8">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold font-headline">
            Monks
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-muted-foreground',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild>
            <Link href="/properties">View Properties</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
