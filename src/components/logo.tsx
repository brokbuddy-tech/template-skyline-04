
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
              <rect x="0" y="22" width="10" height="18" rx="2" fill="#60A5FA" />
              <rect x="14" y="12" width="10" height="28" rx="2" fill="#3B82F6" />
              <rect x="28" y="2" width="10" height="38" rx="2" fill="#1E40AF" />
              <text
                x="52"
                y="32"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="700"
                fontSize="28"
                letterSpacing="1.5"
                className="fill-slate-800 dark:fill-white"
              >
                SKYLINES
              </text>
            </svg>
        </div>
    );
}
