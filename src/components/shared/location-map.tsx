'use client'

import { useEffect, useMemo } from 'react';
import L, { type LatLngExpression } from 'leaflet';
import Link from 'next/link';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';

function createMarkerIcon(active = false) {
    return L.divIcon({
        className: '',
        html: `<span class="leaflet-property-marker${active ? ' is-active' : ''}"></span>`,
        iconSize: [18, 30],
        iconAnchor: [9, 30],
        popupAnchor: [0, -24],
    });
}

function FitMapToMarker({ position }: { position: LatLngExpression }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, 15, { animate: false });
    }, [map, position]);

    return null;
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
    const hasCoordinates = latitude != null && longitude != null;
    const markerPosition = hasCoordinates ? [latitude, longitude] as LatLngExpression : null;
    const openStreetMapUrl = hasCoordinates
        ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`
        : `https://www.openstreetmap.org/search?query=${encodeURIComponent(addressLabel || locationLabel || 'Dubai')}`;
    const markerIcon = useMemo(() => createMarkerIcon(true), []);

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
            <MapContainer
                center={markerPosition}
                zoom={15}
                className="h-full w-full"
                scrollWheelZoom={false}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />
                <FitMapToMarker position={markerPosition} />
                <Marker position={markerPosition} icon={markerIcon}>
                    <Popup>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">
                                {addressLabel || locationLabel || 'Property location'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {latitude?.toFixed(5)}, {longitude?.toFixed(5)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
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
    )
}
