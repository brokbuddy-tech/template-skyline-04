
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <svg
              width="160"
              height="40"
              viewBox="0 0 240 50"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              aria-label="Skylines Real Estate Logo"
            >
              <g>
                <rect x="2" y="24" width="12" height="16" fill="#60A5FA" />
                <rect x="5" y="27" width="6" height="6" fill="#FFFFFF" fillOpacity="0.9" />
                <rect x="18" y="14" width="12" height="26" fill="#3B82F6" />
                <rect x="21" y="17" width="6" height="6" fill="#FFFFFF" fillOpacity="0.9" />
                <rect x="21" y="26" width="6" height="6" fill="#FFFFFF" fillOpacity="0.3" />
                <path d="M34 40 V 5 L 46 2 V 40 H 34 Z" fill="#1E40AF" />
                <rect x="37" y="8" width="6" height="6" fill="#FFFFFF" fillOpacity="0.9" />
                <rect x="37" y="17" width="6" height="6" fill="#FFFFFF" fillOpacity="0.3" />
                <rect x="37" y="26" width="6" height="6" fill="#FFFFFF" fillOpacity="0.3" />
              </g>
              <text
                x="58"
                y="32"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="700"
                fontSize="28"
                letterSpacing="0.5"
                className="fill-slate-800 dark:fill-white"
              >
                SKYLINES
              </text>
            </svg>
        </div>
    );
}
