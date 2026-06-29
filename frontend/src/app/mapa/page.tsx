import Link from "next/link";

const urgencyConfig = {
  critico: { label: "Crítico", icon: "priority_high", color: "bg-error-container text-error" },
  urgente: { label: "Urgente", icon: "warning", color: "bg-secondary-fixed text-secondary" },
  estable: { label: "Estable", icon: "info", color: "bg-surface-container-high text-on-surface-variant" },
} as const;

const categoryConfig = {
  movilidad: { label: "Silla de Ruedas", icon: "accessible" },
  visual: { label: "Visual", icon: "visibility_off" },
  auditiva: { label: "Auditiva", icon: "hearing_disabled" },
  comunicacion: { label: "Comunicación", icon: "psychology" },
} as const;

const requests = [
  {
    id: 1,
    urgency: "critico" as const,
    category: "movilidad" as const,
    title: "Evacuación Requerida",
    description: "Usuario con movilidad reducida requiere transporte adaptado para salir de zona inundable.",
    address: "Calle Mayor 42",
    timeAgo: "Hace 5 min",
  },
  {
    id: 2,
    urgency: "urgente" as const,
    category: "visual" as const,
    title: "Asistencia Médica",
    description: "Paciente con deficiencia visual necesita mediación específica y guía.",
    address: "Plaza Norte, s/n",
    timeAgo: "Hace 12 min",
  },
  {
    id: 3,
    urgency: "estable" as const,
    category: "comunicacion" as const,
    title: "Suministros",
    description: "Entrega de agua y alimentos para familia en aislamiento preventivo.",
    address: "Av. Independencia 102",
    timeAgo: "Hace 25 min",
  },
];

const filters = [
  { key: "todos", label: "Todos", icon: "apps" },
  { key: "movilidad", label: "Movilidad", icon: "accessible" },
  { key: "visual", label: "Visual", icon: "visibility_off" },
  { key: "auditiva", label: "Auditiva", icon: "hearing_disabled" },
  { key: "cognitiva", label: "Cognitiva", icon: "psychology" },
];

export default function MapaPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Solicitudes Activas</h1>
          <p className="text-sm text-on-surface-variant mt-1">Vista de voluntarios — responde solicitudes en tu zona</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-rounded text-base" aria-hidden="true">add_location_alt</span>
          Añadir Incidencia
        </button>
      </div>

      {/* Map placeholder */}
      <div className="rounded-2xl border border-outline-variant bg-surface-container overflow-hidden mb-6">
        <div className="bg-surface-container-high h-56 flex items-center justify-center">
          <div className="text-center text-on-surface-variant">
            <span className="material-symbols-rounded text-5xl block mb-2" aria-hidden="true">map</span>
            <p className="font-medium">Mapa interactivo</p>
            <p className="text-sm mt-1">Integra Google Maps o Mapbox para marcadores en tiempo real.</p>
          </div>
        </div>
        <div className="px-4 py-3 flex items-center gap-2 text-xs text-on-surface-variant border-t border-outline-variant">
          <span className="material-symbols-rounded text-base text-primary" aria-hidden="true">my_location</span>
          Zona de seguridad actualizada hace 2 minutos · Todos los refugios tienen suministro eléctrico.
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
        {filters.map((f, i) => (
          <button
            key={f.key}
            type="button"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              i === 0
                ? "bg-primary text-on-primary"
                : "bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-rounded text-base" aria-hidden="true">{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="flex flex-col gap-3">
        {requests.map((req) => {
          const urg = urgencyConfig[req.urgency];
          const cat = categoryConfig[req.category];
          return (
            <article
              key={req.id}
              className="flex flex-col sm:flex-row sm:items-start gap-4 bg-surface-container-low border border-outline-variant rounded-2xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className={`self-start flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${urg.color}`}>
                <span className="material-symbols-rounded text-sm" aria-hidden="true">{urg.icon}</span>
                {urg.label}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-base text-on-surface">{req.title}</h2>
                  <span className="flex items-center gap-1 text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                    <span className="material-symbols-rounded text-xs" aria-hidden="true">{cat.icon}</span>
                    {cat.label}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1 leading-snug">{req.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-rounded text-xs" aria-hidden="true">location_on</span>
                    {req.address}
                  </span>
                  <span>{req.timeAgo}</span>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col">
                <button
                  type="button"
                  className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-rounded text-base" aria-hidden="true">check_circle</span>
                  Aceptar
                </button>
                <Link
                  href="/chat"
                  className="flex items-center gap-1.5 border border-outline text-on-surface px-4 py-2 rounded-full text-sm font-semibold hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-rounded text-base" aria-hidden="true">share</span>
                  Detalle
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
