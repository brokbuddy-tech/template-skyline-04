'use client'

import Link from "next/link"

export function LocationMap({
    latitude,
    longitude,
    locationLabel,
    addressLabel,
}: {
    latitude?: number | null;
    longitude?: number | null;
    locationLabel?: string;
    addressLabel?: string;
}) {
    const mapQuery = latitude != null && longitude != null
        ? `${latitude},${longitude}`
        : addressLabel || locationLabel || 'Dubai';
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
    const googleEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;

    return (
        <div className="w-full h-96 rounded-lg overflow-hidden relative">
            <iframe
                src={googleEmbedUrl}
                title={locationLabel ? `Map of ${locationLabel}` : 'Property location'}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-background/90 via-background/55 to-transparent px-4 py-4">
                <p className="text-sm font-semibold text-foreground">
                    {addressLabel || locationLabel || 'Dubai'}
                </p>
                {latitude != null && longitude != null && (
                    <p className="text-xs text-muted-foreground">
                        {latitude.toFixed(5)}, {longitude.toFixed(5)}
                    </p>
                )}
            </div>
            <div className="absolute bottom-4 right-4">
                <Link
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg"
                >
                    Open in Maps
                </Link>
            </div>
        </div>
    )
}
