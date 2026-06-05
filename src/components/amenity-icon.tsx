"use client";

import { useEffect, useState } from "react";
import { DEFAULT_AMENITY_ICON_PATH, getAmenityIconPath } from "@/lib/amenity-icons";

interface AmenityIconProps {
  name: string;
  className?: string;
  alt?: string;
}

export function AmenityIcon({ name, className = "h-4 w-4", alt = "" }: AmenityIconProps) {
  const iconPath = getAmenityIconPath(name);
  const [src, setSrc] = useState(iconPath);

  useEffect(() => {
    setSrc(iconPath);
  }, [iconPath]);

  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={`shrink-0 object-contain ${className}`}
      loading="lazy"
      onError={() => {
        if (src !== DEFAULT_AMENITY_ICON_PATH) {
          setSrc(DEFAULT_AMENITY_ICON_PATH);
        }
      }}
    />
  );
}
