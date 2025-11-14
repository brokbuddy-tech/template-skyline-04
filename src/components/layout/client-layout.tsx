"use client";

import React, { useState, useEffect } from "react";
import { SplashScreen } from "@/components/splash-screen";
import { PageTransition } from "@/components/page-transition";
import { CustomCursor } from "@/components/custom-cursor";
import { ThemeSwitch } from "../shared/theme-switch";
import { AIChatbot } from "../shared/ai-chatbot";
import { Toaster } from "../ui/toaster";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

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
        <SplashScreen isLoading={true} />
      </>
    );
  }
  
  return (
    <>
      <CustomCursor />
      {isLoading ? (
        <SplashScreen isLoading={isLoading} />
      ) : (
        <PageTransition>
          {children}
        </PageTransition>
      )}
      <div className="fixed bottom-4 right-4 md:bottom-24 md:right-8 z-50">
        <AIChatbot />
      </div>
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <ThemeSwitch />
      </div>
      <Toaster />
    </>
  );
}
