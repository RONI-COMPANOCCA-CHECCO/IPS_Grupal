// Opción 1: Crear un componente de mapa pequeño para las cards
"use client";

import { useEffect, useRef, useState } from "react";

interface MiniMapProps {
  lat: number;
  lng: number;
  projectName: string;
  height?: string;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  lat,
  lng,
  projectName,
  height = "150px",
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const linkElement = document.createElement("link");
          linkElement.rel = "stylesheet";
          linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          linkElement.integrity =
            "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          linkElement.crossOrigin = "";
          document.head.appendChild(linkElement);
        }

        if (!(window as any).L) {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.integrity =
            "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
          script.crossOrigin = "";
          script.onload = () => setLeafletLoaded(true);
          document.head.appendChild(script);
        } else {
          setLeafletLoaded(true);
        }
      } catch (error) {
        console.error("Error loading Leaflet:", error);
      }
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    try {
      const L = (window as any).L;

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        html: `
          <div style="
            background: #dc3545;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            border: 2px solid white;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          ">
            📍
          </div>
        `,
        className: "mini-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      L.marker([lat, lng], { icon: customIcon }).addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    } catch (error) {
      console.error("Error creating mini map:", error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, lat, lng]);

  if (!leafletLoaded) {
    return (
      <div
        style={{
          height,
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{ textAlign: "center", color: "#6c757d", fontSize: "12px" }}
        >
          🗺️ Cargando...
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        height,
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #ddd",
        backgroundColor: "#f8f9fa",
        cursor: "pointer",
      }}
      title={`Ver ubicación de ${projectName}`}
    />
  );
};
