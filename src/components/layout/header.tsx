'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Logo } from '../logo';

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
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/properties', label: 'Properties' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-background transition-shadow duration-300',
        isScrolled ? 'shadow-sm border-b' : 'border-b border-background'
      )}
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
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground group" asChild>
            <Link href="#">Buy This Template <span className="transform transition-transform duration-300 group-hover:rotate-[-45deg]">↗</span></Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
