'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

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
        isScrolled ? 'shadow-sm border-b' : 'border-b border-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-8">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            Monks Estate
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-primary border-primary hover:text-primary" asChild>
            <Link href="#">Buy This Template</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
