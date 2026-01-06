
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
                  <linearGradient id="skylineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#00BFFF', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#000080', stopOpacity: 1 }} />
                  </linearGradient>
                   <style>
                    {`
                      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
                    `}
                  </style>
              </defs>
              
              {/* Icon */}
              <g transform="translate(10, 5)">
                  <rect x="0" y="10" width="4" height="10" fill="url(#skylineGradient)" />
                  <rect x="6" y="5" width="4" height="15" fill="url(#skylineGradient)" />
                  <rect x="12" y="0" width="4" height="20" fill="url(#skylineGradient)" />
                  <rect x="18" y="8" width="4" height="12" fill="url(#skylineGradient)" />
                  <rect x="24" y="12" width="4" height="8" fill="url(#skylineGradient)" />
              </g>

              {/* Text */}
              <text 
                x="40" 
                y="27" 
                fontFamily="Montserrat, sans-serif" 
                fontSize="18" 
                fontWeight="bold" 
                fill="hsl(var(--foreground))"
              >
                SKYLINES
              </text>
            </svg>
        </div>
    );
}
