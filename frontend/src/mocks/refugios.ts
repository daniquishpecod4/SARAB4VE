import { iRefugio, AccessibilityTag, ServiceTag } from "@/types";

export const CONFIGURACION_ESTADO = {
    activo: { label: "Activo", color: "bg-[#d4edda] text-[#155724]" },
    lleno: { label: "Lleno", color: "bg-[#fff3cd] text-[#856404]" },
    cerrado: { label: "Cerrado", color: "bg-[#f8d7da] text-[#721c24]" },
};

export const CONFIGURACION_ACCESIBILIDAD: { key: AccessibilityTag; icon: string; label: string }[] = [
    { key: "rampas", icon: "accessible", label: "Rampas de Acceso" },
    { key: "banio", icon: "wc", label: "Baño Adaptado" },
    { key: "lengua_senas", icon: "sign_language", label: "Lengua de Señas" },
    { key: "animales", icon: "pets", label: "Animales de Servicio" },
];

export const CONFIGURACION_SERVICIOS: Record<ServiceTag, string> = {
    wifi: "WiFi",
    salud: "Salud",
    comida: "Comida",
};

export const Refugios: iRefugio[] = [
    {
        id: "1",
        name: "Centro Cívico Norte",
        address: "Calle Esperanza 456, Sector 2",
        sector: "Sector 2",
        status: "activo",
        tags: ["rampas", "banio", "lengua_senas"],
        services: ["wifi", "salud", "comida"],
        lat: 10.48,
        lng: -66.9,
        distance: "350 m",
        imagen: "/images/centro_civico_norte.png",
    },
    {
        id: "2",
        name: "Refugio Municipal #3",
        address: "Av. Principal 120, Los Caobos",
        sector: "Los Caobos",
        status: "activo",
        tags: ["rampas", "animales"],
        services: ["comida"],
        lat: 10.475,
        lng: -66.905,
        distance: "1.2 km",
    },
    {
        id: "3",
        name: "Centro de Salud Chacao",
        address: "Calle Real 89, Chacao",
        sector: "Chacao",
        status: "activo",
        tags: ["rampas", "banio", "lengua_senas", "animales"],
        services: ["wifi", "salud"],
        lat: 10.484,
        lng: -66.852,
        distance: "800 m",
    },
    {
        id: "4",
        name: "Escuela Técnica Bolivariana",
        address: "Urb. Bello Monte, Calle 5",
        sector: "Bello Monte",
        status: "lleno",
        tags: ["rampas"],
        services: ["comida"],
        lat: 10.472,
        lng: -66.895,
        distance: "2.1 km",
    },
    {
        id: "5",
        name: "Polideportivo El Valle",
        address: "El Valle, Sector Industrial",
        sector: "El Valle",
        status: "cerrado",
        tags: [],
        services: [],
        lat: 10.46,
        lng: -66.92,
        distance: "3.5 km",
    },
];