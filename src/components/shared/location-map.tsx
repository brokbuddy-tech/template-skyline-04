'use client'

import { useEffect, useRef } from 'react';
import L, { type LatLngExpression } from 'leaflet';
import Link from 'next/link';

function createMarkerIcon(active = false) {
    return L.divIcon({
        className: '',
        html: `<span class="leaflet-property-marker${active ? ' is-active' : ''}"></span>`,
        iconSize: [18, 30],
        iconAnchor: [9, 30],
        popupAnchor: [0, -24],
    });
}

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
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);

    const hasCoordinates = latitude != null && longitude != null;
    const markerPosition = hasCoordinates
        ? [latitude, longitude] as LatLngExpression
        : null;
    const openStreetMapUrl = hasCoordinates
        ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`
        : `https://www.openstreetmap.org/search?query=${encodeURIComponent(addressLabel || locationLabel || 'Dubai')}`;

    useEffect(() => {
        if (!containerRef.current || !markerPosition) return;

        // Destroy any previous map instance on this container
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        const map = L.map(containerRef.current, {
            center: markerPosition,
            zoom: 15,
            scrollWheelZoom: false,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const marker = L.marker(markerPosition, {
            icon: createMarkerIcon(true),
        }).addTo(map);

        marker.bindPopup(
            `<div style="line-height:1.5">
                <p style="font-weight:600;font-size:0.875rem">${addressLabel || locationLabel || 'Property location'}</p>
                <p style="font-size:0.75rem;opacity:0.7">${latitude?.toFixed(5)}, ${longitude?.toFixed(5)}</p>
            </div>`
        );

        mapRef.current = map;

        // Leaflet needs a tick to measure the container correctly
        const timer = setTimeout(() => map.invalidateSize(), 200);

        return () => {
            clearTimeout(timer);
            map.remove();
            mapRef.current = null;
        };
    }, [latitude, longitude]);

    if (!markerPosition) {
        return (
            <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg border border-border bg-muted/35 px-6 text-center">
                <p className="text-lg font-semibold text-foreground">Location pin unavailable</p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    This listing does not have a saved latitude and longitude pair yet.
                </p>
                {(addressLabel || locationLabel) && (
                    <p className="mt-4 text-sm font-medium text-foreground">{addressLabel || locationLabel}</p>
                )}
            </div>
        );
    }

    return (
        <div className="leaflet-property-map relative h-96 w-full overflow-hidden rounded-lg border border-border">
            <div ref={containerRef} className="h-full w-full" />
            <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-background/90 via-background/55 to-transparent px-4 py-4">
                <p className="text-sm font-semibold text-foreground">
                    {addressLabel || locationLabel || 'Dubai'}
                </p>
                <p className="text-xs text-muted-foreground">
                    {latitude?.toFixed(5)}, {longitude?.toFixed(5)}
                </p>
            </div>
            <div className="absolute bottom-4 right-4">
                <Link
                    href={openStreetMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg"
                >
                    Open in OpenStreetMap
                </Link>
            </div>
        </div>
    );
}
