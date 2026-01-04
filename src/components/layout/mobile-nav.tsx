'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeSwitch } from '../shared/theme-switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { NavConfig } from '@/lib/nav-config';

export function MobileNav({ navLinks }: { navLinks: NavConfig }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <label className="hamburger">
        <input type="checkbox" checked={isOpen} onChange={() => setIsOpen(!isOpen)} />
        <svg viewBox="0 0 32 32">
          <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" />
          <path className="line" d="M7 16 27 16" />
        </svg>
      </label>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-white transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="container mx-auto flex flex-col justify-between h-full py-20 overflow-y-auto">
          <nav className="flex flex-col text-left mt-8 w-full">
            <Accordion type="multiple" className="w-full">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <AccordionItem key={link.label} value={link.label}>
                    <AccordionTrigger className="text-3xl font-headline font-medium text-gray-900 hover:text-rose-500 no-underline">
                      {link.label}
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      {link.dropdown.map((column, colIndex) => (
                        <div key={colIndex} className="mb-6">
                          <h3 className="font-bold text-gray-900 mb-2">{column.header}</h3>
                          <ul className="space-y-2">
                            {column.links.map((item) => (
                              <li key={item.label}>
                                <Link href={item.href} onClick={handleLinkClick} className="text-lg text-gray-700 hover:text-rose-500 block">
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className="text-3xl font-headline font-medium text-gray-900 hover:text-rose-500 py-4 border-b"
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </Accordion>
          </nav>
          <div className="flex flex-col items-center gap-8 mt-auto pt-8">
            <Button
              variant="default"
              size="lg"
              asChild
              onClick={handleLinkClick}
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
