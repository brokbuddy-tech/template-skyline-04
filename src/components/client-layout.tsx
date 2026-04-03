"use client";

import React, { useEffect, useState } from "react";
import { CustomCursor } from "@/components/custom-cursor";
import { SplashScreen } from "@/components/splash-screen";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("splashShown")) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("splashShown", "true");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CustomCursor />
      {isLoading ? <SplashScreen isLoading={isLoading} /> : children}
    </>
  );
}
