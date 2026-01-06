
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <svg
              width="140"
              height="40"
              viewBox="0 0 140 40"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current text-accent"
            >
              <defs>
                  <pattern id="grid" width="2" height="4" patternUnits="userSpaceOnUse">
                      <path d="M 0 2 H 2" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                  <style>
                    {`
                      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
                    `}
                  </style>
              </defs>
              
              <text fontFamily="Montserrat, sans-serif" fontSize="18" fontWeight="bold" fill="currentColor" y="30">
                <tspan x="0">S</tspan>
                <tspan x="12" y="20" fontSize="24">K</tspan>
                <tspan x="28" y="10" fontSize="36">Y</tspan>
                <tspan x="42" y="15" fontSize="30">L</tspan>
                <tspan x="54" y="5" fontSize="42">I</tspan>
                <tspan x="62" y="18" fontSize="26">N</tspan>
                <tspan x="78">E</tspan>
                <tspan x="90">S</tspan>
              </text>
              
              {/* Skylines effect */}
              <rect x="28" y="0" width="3" height="10" fill="currentColor" />
              <rect x="42" y="0" width="3" height="15" fill="currentColor" />
              <rect x="54" y="0" width="3" height="30" fill="url(#grid)" />
              <rect x="62" y="0" width="3" height="18" fill="url(#grid)" />
            </svg>
        </div>
    );
}
