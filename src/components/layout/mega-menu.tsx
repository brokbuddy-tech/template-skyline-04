
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavConfig } from '@/lib/nav-config';

interface MegaMenuProps {
  navConfig: NavConfig;
}

const getHrefMatchScore = (
  pathname: string,
  searchParams: ReturnType<typeof useSearchParams>,
  href?: string,
) => {
  if (!href) return 0;

  const [hrefPath, hrefQuery = ''] = href.split('?');
  const pathMatches = pathname === hrefPath || (hrefPath !== '/' && pathname.startsWith(`${hrefPath}/`));
  if (!pathMatches) return 0;
  if (!hrefQuery) return 1;

  const hrefParams = new URLSearchParams(hrefQuery);
  for (const [key, value] of hrefParams.entries()) {
    if (searchParams.get(key) !== value) {
      return 0;
    }
  }

  return 1 + Array.from(hrefParams.keys()).length;
};

export function MegaMenu({ navConfig }: MegaMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const activeItem = navConfig
    .map((item) => {
      const ownScore = getHrefMatchScore(pathname, searchParams, item.href);
      const dropdownScore = Math.max(
        0,
        ...(item.dropdown?.flatMap((column) =>
          column.links.map((link) => getHrefMatchScore(pathname, searchParams, link.href))
        ) ?? [])
      );

      return {
        item,
        score: Math.max(ownScore, dropdownScore),
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)[0]?.item;
  const activeKey = activeItem?.label;
  const [activeUnderline, setActiveUnderline] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const updateUnderline = () => {
      if (!activeKey || !navRef.current) {
        setActiveUnderline(null);
        return;
      }

      const activeElement = itemRefs.current[activeKey];
      if (!activeElement) {
        setActiveUnderline(null);
        return;
      }

      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = activeElement.getBoundingClientRect();
      setActiveUnderline({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
      });
    };

    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeKey]);

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
    <div ref={navRef} className="flex gap-2 relative pb-2" onMouseLeave={handleMouseLeave}>
      {activeUnderline && (
        <span
          className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-rose-500 transition-all duration-300 ease-out"
          style={{
            left: activeUnderline.left,
            width: activeUnderline.width,
          }}
        />
      )}
      {navConfig.map((item, index) => {
        const isCommercialMenu = item.label === 'Commercial';
        const isActive = item.label === activeKey;

        return (
          <div
            key={item.label}
            className="relative"
            ref={(node) => {
              itemRefs.current[item.label] = node;
            }}
            onMouseEnter={() => handleMouseEnter(index)}
          >
            <Link
              href={item.href || '#'}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm text-gray-900 dark:text-white rounded-md transition-colors",
                hoveredIndex === index || isActive ? "text-rose-500 bg-rose-50 dark:bg-gray-800" : "hover:text-rose-500"
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
