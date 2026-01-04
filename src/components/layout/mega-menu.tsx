
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavConfig } from '@/lib/nav-config';

interface MegaMenuProps {
  navConfig: NavConfig;
}

export function MegaMenu({ navConfig }: MegaMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 100);
  };

  return (
    <div className="flex gap-2 relative" onMouseLeave={handleMouseLeave}>
      {navConfig.map((item, index) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => handleMouseEnter(index)}
        >
          <Link
            href={item.href || '#'}
            className={cn(
              "flex items-center gap-1 px-3 py-2 text-sm text-gray-900 rounded-md transition-colors",
              hoveredIndex === index ? "text-rose-500 bg-rose-50" : "hover:text-rose-500"
            )}
          >
            <span>{item.label}</span>
            {item.dropdown && <ChevronDown className="w-4 h-4 transition-transform" />}
          </Link>

          <AnimatePresence>
            {hoveredIndex === index && item.dropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeInOut' } }}
                exit={{ opacity: 0, y: 5, transition: { duration: 0.2, ease: 'easeInOut' } }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-100">
                  <div 
                    className="grid gap-x-12 gap-y-6"
                    style={{ gridTemplateColumns: `repeat(${item.dropdown.length}, minmax(0, 1fr))` }}
                  >
                    {item.dropdown.map((column, colIndex) => (
                      <div key={colIndex}>
                        <h3 className="font-bold text-gray-900 mb-3 text-base">{column.header}</h3>
                        <ul className="space-y-2">
                          {column.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                className="block text-sm text-gray-700 hover:text-rose-500 whitespace-nowrap"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
