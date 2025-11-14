"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    // When the path changes, trigger the exit animation
    setIsExiting(true);
    const exitTimer = setTimeout(() => {
      // After the exit animation, reset the state and trigger the enter animation
      setIsExiting(false);
      setIsEntering(true);
      const enterTimer = setTimeout(() => setIsEntering(false), 400); // Duration of enter animation
      return () => clearTimeout(enterTimer);
    }, 400); // Duration of exit animation

    return () => clearTimeout(exitTimer);
  }, [pathname]);

  return (
    <div className="relative">
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-primary z-50 transform ${
          isExiting ? "animate-page-wipe-in" : ""
        } ${isEntering ? "animate-page-wipe-out" : "translate-x-full"} pointer-events-none`}
      />
      {children}
    </div>
  );
}
