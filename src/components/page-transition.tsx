"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HourglassLoader } from "./hourglass-loader";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true); // Start as true to hide content initially
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    // Let initial server-rendered content show immediately without transition
    setIsEntering(false);
  }, []);

  useEffect(() => {
    if (pathname !== currentPath) {
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        // After the exit animation, update the path and trigger enter animation
        setCurrentPath(pathname);
        setIsExiting(false);
        setIsEntering(true);
        const enterTimer = setTimeout(() => {
          setIsEntering(false);
        }, 400); // Duration of the fade-out of the curtain
        return () => clearTimeout(enterTimer);
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
      <div style={{ visibility: isEntering && !isExiting ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </div>
  );
}