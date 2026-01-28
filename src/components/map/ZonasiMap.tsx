"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface ZonasiMapProps {
    center: [number, number];
    schoolName: string;
    radiusPrimer?: number; // in kilometers
    radiusSekunder?: number; // in kilometers
    className?: string;
}

export default function ZonasiMap({
    center,
    schoolName,
    radiusPrimer = 3,
    radiusSekunder = 5,
    className = "",
}: ZonasiMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map
        const map = L.map(mapRef.current).setView(center, 14);
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Add school marker
        const marker = L.marker(center).addTo(map);
        marker.bindPopup(`<b>${schoolName}</b><br/>Lokasi Sekolah`).openPopup();

        // Add secondary zone circle (outer - draw first)
        L.circle(center, {
            color: "#f59e0b",
            fillColor: "#fbbf24",
            fillOpacity: 0.15,
            radius: radiusSekunder * 1000, // convert km to meters
            weight: 2,
            dashArray: "5, 5",
        }).addTo(map).bindPopup(`Zona Sekunder (${radiusSekunder} km)`);

        // Add primary zone circle (inner - draw second)
        L.circle(center, {
            color: "#3b82f6",
            fillColor: "#60a5fa",
            fillOpacity: 0.25,
            radius: radiusPrimer * 1000, // convert km to meters
            weight: 2,
        }).addTo(map).bindPopup(`Zona Primer (${radiusPrimer} km)`);

        // Fit bounds to show both circles
        const bounds = L.latLngBounds(center, center).pad(radiusSekunder / 10);
        map.fitBounds(bounds);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [center, schoolName, radiusPrimer, radiusSekunder]);

    return (
        <div
            ref={mapRef}
            className={`w-full h-full min-h-[400px] rounded-xl overflow-hidden ${className}`}
        />
    );
}
