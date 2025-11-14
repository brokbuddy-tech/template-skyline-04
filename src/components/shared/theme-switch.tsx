'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="w-24 aspect-video rounded-lg has-[:checked]:bg-black bg-white border-2 border-black has-[:checked]:border-white">
      <div className="flex h-full w-full px-1 items-center gap-x-1">
        <div className="w-3 h-3 flex-shrink-0 rounded-full border-2 border-black group-has-[:checked]:border-white" />
        <label htmlFor="switch" className="has-[:checked]:scale-x-[-1] w-full h-5 border-2 border-black rounded cursor-pointer group-has-[:checked]:border-white">
          <input type="checkbox" id="switch" className="hidden group" checked={isDark} onChange={toggleTheme} />
          <div className="w-full h-full bg-[#FF4D00] relative">
            <div className="w-0 h-0 z-20 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[10px] border-t-black relative group-has-[:checked]:border-t-white">
              <div className="w-0 h-0 absolute border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[7.5px] border-t-[#FF4D00] -top-[10px] -left-[9px]" />
            </div>
            <div className="w-[12px] h-5 z-10 absolute top-[4.5px] left-0 bg-[#FF4D00] border-r-2 border-b-2 border-black transform skew-y-[39deg] group-has-[:checked]:border-white" />
            <div className="w-[12.5px] h-5 z-10 absolute top-[4.5px] left-[12px] bg-[#FF4D00] border-r-2 border-l-2 border-b-2 border-black transform skew-y-[-39deg] group-has-[:checked]:border-white" />
          </div>
        </label>
        <div className="w-3 h-0.5 flex-shrink-0 bg-black rounded-full group-has-[:checked]:bg-white" />
      </div>
    </div>
  );
}
