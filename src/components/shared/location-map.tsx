'use client'

import Image from "next/image"
import Link from "next/link"

export function LocationMap({
    latitude,
    longitude,
    locationLabel,
}: {
    latitude?: number | null;
    longitude?: number | null;
    locationLabel?: string;
}) {
    // In a real application, this would be an interactive map component like Google Maps or Mapbox.
    // For this prototype, we'll use a static image.
    const mapImageUrl = "https://images.unsplash.com/photo-1584931422238-34f37895156c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    const mapQuery = latitude != null && longitude != null
        ? `${latitude},${longitude}`
        : locationLabel || 'Dubai';
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

    return (
        <div className="w-full h-96 rounded-lg overflow-hidden relative">
            <Image
                src={mapImageUrl}
                alt="Property Location"
                layout="fill"
                objectFit="cover"
                className="brightness-90"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    <div className="w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
                </div>
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
