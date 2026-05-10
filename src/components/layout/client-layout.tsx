
"use client";

import React, { useState, useEffect } from "react";
import { SplashScreen } from "@/components/splash-screen";
import { CustomCursor } from "@/components/custom-cursor";
import { ThemeSwitch } from "../shared/theme-switch";
import { AIChatbot } from "../shared/ai-chatbot";
import { Toaster } from "../ui/toaster";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import type { SiteConfig } from "@/lib/types";

export function ClientLayout({
  children,
  initialSiteConfig,
}: {
  children: React.ReactNode;
  initialSiteConfig?: SiteConfig | null;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (sessionStorage.getItem("splashShown")) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("splashShown", "true");
    }, 2000); // Splash screen duration

    return () => clearTimeout(timer);
  }, [isMounted]);

  if (!isMounted) {
    // Return a static version of what the client will render on first pass
    // to avoid hydration errors.
    return (
      <>
        <CustomCursor />
        <SplashScreen isLoading={true} initialSiteConfig={initialSiteConfig} />
      </>
    );
  }
  
  return (
    <>
      <CustomCursor />
      {isLoading ? (
        <SplashScreen isLoading={isLoading} initialSiteConfig={initialSiteConfig} />
      ) : (
        <div key={pathname}>
          {children}
        </div>
      )}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-4">
        <AIChatbot />
      </div>
      <Toaster />
    </>
  );
}
