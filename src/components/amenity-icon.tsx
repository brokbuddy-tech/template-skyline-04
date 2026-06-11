import type { IconType } from "react-icons";
import * as FaIcons from "react-icons/fa6";
import { DEFAULT_AMENITY_ICON_COMPONENT, getAmenityIconComponentName } from "@/lib/amenity-icons";

interface AmenityIconProps {
  name: string;
  className?: string;
  alt?: string;
}

const FALLBACK_ICON = FaIcons[DEFAULT_AMENITY_ICON_COMPONENT as keyof typeof FaIcons] as IconType;

export function AmenityIcon({ name, className = "h-4 w-4", alt = "" }: AmenityIconProps) {
  const iconName = getAmenityIconComponentName(name);
  const Icon = (FaIcons[iconName as keyof typeof FaIcons] as IconType | undefined) ?? FALLBACK_ICON;

  return (
    <span
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
    >
      <Icon className="h-full w-full" />
    </span>
  );
}
