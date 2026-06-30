"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { iRefugio, LeafletMapProps } from "@/types";


export default function LeafletMap({ shelters, selectedId, onSelect }: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const [isMapReady, setIsMapReady] = useState(false);

  // Inicializar Mapa
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Centrar en Caracas
    const defaultCenter: L.LatLngTuple = [10.48, -66.90];
    const defaultZoom = 13;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView(defaultCenter, defaultZoom);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;
    setIsMapReady(true);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current.parentElement) {
      resizeObserver.observe(mapContainerRef.current.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    Object.values(markersRef.current).forEach((marker) => {
      marker.remove();
    });
    markersRef.current = {};

    shelters.forEach((shelter) => {
      const isSelected = selectedId === shelter.id;

      let icon: L.DivIcon;

      if (isSelected) {

        icon = L.divIcon({
          html: `
            <div class="flex flex-col items-center justify-center select-none" style="transform: translate(-50%, -75%);">
              <!-- Marker Pin -->
              <div class="w-8 h-8 rounded-full bg-[#0040a1] flex items-center justify-center border-2 border-white shadow-lg animate-bounce-short">
                <span class="material-symbols-rounded text-white text-[18px]">location_on</span>
              </div>
              <!-- Text Label -->
              <div class="mt-1 bg-white border border-[#0040a1] text-[#0040a1] px-2 py-0.5 rounded shadow text-[10px] font-bold whitespace-nowrap">
                ${shelter.name}
              </div>
            </div>
          `,
          className: "custom-marker-active",
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
      } else {

        icon = L.divIcon({
          html: `
            <div class="flex items-center justify-center select-none" style="transform: translate(-50%, -50%);">
              <div class="w-7 h-7 rounded-lg bg-[#a83900] flex items-center justify-center border-2 border-white shadow hover:scale-110 transition-transform">
                <span class="material-symbols-rounded text-white text-[16px]">emergency_home</span>
              </div>
            </div>
          `,
          className: "custom-marker-inactive",
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
      }

      const marker = L.marker([shelter.lat, shelter.lng], { icon })
        .addTo(map)
        .on("click", () => {
          onSelect(isSelected ? null : shelter.id);
        });

      markersRef.current[shelter.id] = marker;
    });
  }, [shelters, selectedId, isMapReady, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady || !selectedId) return;

    const selectedShelter = shelters.find((s) => s.id === selectedId);
    if (selectedShelter) {
      map.flyTo([selectedShelter.lat, selectedShelter.lng], 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedId, shelters, isMapReady]);

  // Personalizar zoom
  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  // Geolocalizar / Re-centrar en el grupo de refugios
  const handleLocate = () => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    if (selectedId) {
      const selected = shelters.find((s) => s.id === selectedId);
      if (selected) {
        map.flyTo([selected.lat, selected.lng], 15);
        return;
      }
    }

    if (shelters.length > 0) {
      const group = L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.15), {
        animate: true,
        duration: 1.2,
      });
    } else {
      map.flyTo([10.48, -66.90], 13);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Contenedor del mapa */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      <div className="absolute bottom-20 right-4 z-[500] flex flex-col gap-2 pointer-events-none">
        {/* Control de zoom */}
        <div className="flex flex-col bg-white border border-outline-variant rounded-xl shadow-md overflow-hidden pointer-events-auto">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-container transition-colors border-b border-outline-variant font-bold text-lg text-on-surface"
            aria-label="Acercar mapa"
          >
            <span className="material-symbols-rounded text-xl">add</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-container transition-colors font-bold text-lg text-on-surface"
            aria-label="Alejar mapa"
          >
            <span className="material-symbols-rounded text-xl">remove</span>
          </button>
        </div>

        {/* Botón de Geolocalización */}
        <button
          onClick={handleLocate}
          className="w-10 h-10 flex items-center justify-center bg-white border border-outline-variant rounded-xl shadow-md hover:bg-surface-container transition-colors pointer-events-auto text-on-surface"
          aria-label="Mi ubicación o centrar mapa"
        >
          <span className="material-symbols-rounded text-xl">my_location</span>
        </button>
      </div>

      {/* Estilos para personalizar iconos y animación -*/}
      <style jsx global>{`
        @keyframes bounce-short {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-bounce-short {
          animation: bounce-short 1.5s ease-in-out infinite;
        }
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
