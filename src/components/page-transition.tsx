"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HourglassLoader } from "./hourglass-loader";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);
  const [key, setKey] = useState(pathname); // Use a key to force re-render of children

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        setCurrentPath(pathname);
        setKey(pathname); // Change the key to re-render children
        setIsExiting(false);
      }, 1500); // Duration the loader is visible

      return () => clearTimeout(exitTimer);
    }
  }, [pathname, currentPath]);

  return (
    <div className="relative">
      {isExiting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-fade-in"
        >
          <HourglassLoader />
        </div>
      )}
      <div key={key}>
        {children}
      </div>
    </div>
  );
}
