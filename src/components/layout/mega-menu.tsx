
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
    }, 200);
  };

  return (
    <div className="flex gap-2 relative" onMouseLeave={handleMouseLeave}>
      {navConfig.map((item, index) => {
        const isCommercialMenu = item.label === 'Commercial';
        const isSimpleDropdown = false; // We are not using the simple dropdown for now.

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
          >
            <Link
              href={item.href || '#'}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm text-gray-900 dark:text-white rounded-md transition-colors",
                hoveredIndex === index ? "text-rose-500 bg-rose-50 dark:bg-gray-800" : "hover:text-rose-500"
              )}
            >
              <span>{item.label}</span>
              {item.dropdown && <ChevronDown className="w-4 h-4 transition-transform" />}
            </Link>
            
            {/* This is the invisible "bridge" to prevent premature closing */}
            <div className="absolute bottom-0 left-0 w-full h-5" />

            <AnimatePresence>
              {hoveredIndex === index && item.dropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{
                    type: 'spring',
                    mass: 0.5,
                    stiffness: 150,
                    damping: 25,
                  }}
                  className={cn(
                    "absolute top-full mt-2 left-1/2 -translate-x-1/2",
                  )}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={cn(
                    "bg-white dark:bg-black rounded-lg shadow-xl border border-gray-100 dark:border-gray-800",
                    isCommercialMenu ? "min-w-[400px] p-8" : "p-6"
                  )}>
                    {isCommercialMenu ? (
                      <div>
                        <div className="grid grid-cols-2 gap-12">
                          {item.dropdown?.slice(0, 2).map((column, colIndex) => (
                            <div key={colIndex}>
                              <h3 className="text-lg font-bold text-[#1E1E2C] dark:text-white mb-4">{column.header}</h3>
                              <ul className="space-y-3">
                                {column.links.map((link) => (
                                  <li key={link.label}>
                                    <Link
                                      href={link.href}
                                      className="block text-[15px] text-gray-600 dark:text-gray-400 font-medium hover:text-[#E11D48] transition-colors"
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        {item.dropdown && item.dropdown.length > 2 && (
                           <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                             <Link href={item.dropdown[2].links[0].href} className="text-[#E11D48] font-bold hover:underline">
                               {item.dropdown[2].links[0].label}
                             </Link>
                           </div>
                        )}
                      </div>
                    ) : (
                      <div 
                        className="grid gap-x-12 gap-y-6 auto-cols-max"
                        style={{ gridTemplateColumns: `repeat(${item.dropdown.length}, auto)` }}
                      >
                        {item.dropdown.map((column, colIndex) => (
                          <div key={colIndex}>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-base">{column.header}</h3>
                            <ul className="space-y-2">
                              {column.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    className="block text-sm text-gray-700 dark:text-gray-300 hover:text-rose-500 whitespace-nowrap"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  );
}
