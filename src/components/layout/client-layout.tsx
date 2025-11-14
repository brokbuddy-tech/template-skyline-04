"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { SplashScreen } from "@/components/splash-screen";
import { PageTransition } from "@/components/page-transition";
import { CustomCursor } from "@/components/custom-cursor";
import { StickySearch } from "../shared/sticky-search";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent splash screen on subsequent visits in the same session
    if (sessionStorage.getItem("splashShown")) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("splashShown", "true");
    }, 3000); // Splash screen duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CustomCursor />
      {isLoading ? (
        <SplashScreen />
      ) : (
        <PageTransition>
          {children}
        </PageTransition>
      )}
      <StickySearch />
    </>
  );
}
