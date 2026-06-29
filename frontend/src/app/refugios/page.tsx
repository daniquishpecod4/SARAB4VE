const accessibilityFilters = [
  { key: "rampas", label: "Rampas de Acceso", icon: "accessible" },
  { key: "bano", label: "Baño Adaptado", icon: "wc" },
  { key: "lse", label: "Lengua de Señas", icon: "interpreter_mode" },
  { key: "animales", label: "Animales de Servicio", icon: "pets" },
];

const shelters = [
  {
    name: "Centro Cívico Norte",
    address: "Calle Esperanza 450, Sector 2",
    status: "activo" as const,
    services: ["wifi", "medical_services", "restaurant"],
    features: ["rampas", "bano", "lse"],
    capacity: "48 / 120",
  },
  {
    name: "Refugio Municipal #3",
    address: "Av. Principal, entre calles 5 y 6",
    status: "disponible" as const,
    services: ["medical_services", "restaurant"],
    features: ["rampas", "bano"],
    capacity: "32 / 80",
  },
  {
    name: "Escuela Primaria #12",
    address: "Urb. Los Pinos, Calle 3",
    status: "disponible" as const,
    services: ["restaurant"],
    features: ["rampas"],
    capacity: "10 / 60",
  },
];

const statusConfig = {
  activo: { label: "Activo", color: "bg-error-container text-error" },
  disponible: { label: "Disponible", color: "bg-primary-fixed text-primary" },
} as const;

const serviceLabels: Record<string, string> = {
  wifi: "WiFi",
  medical_services: "Salud",
  restaurant: "Comida",
};

export default function RefugiosPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Refugios Disponibles</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Espacios con accesibilidad garantizada para pernocta o resguardo.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" aria-hidden="true">search</span>
        <input
          type="search"
          placeholder="Buscar refugio por nombre o zona..."
          className="w-full rounded-xl border border-outline-variant bg-surface-container-low pl-12 pr-4 py-3 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Accessibility filter chips */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Filtros de Accesibilidad</p>
        <div className="flex flex-wrap gap-2">
          {accessibilityFilters.map((f, i) => (
            <button
              key={f.key}
              type="button"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                i === 1
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-rounded text-base" aria-hidden="true">{f.icon}</span>
              {f.label}
              {i === 1 && <span className="material-symbols-rounded text-sm" aria-hidden="true">check_circle</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-5 flex items-start gap-3 bg-primary-fixed border border-outline-variant rounded-xl px-4 py-3">
        <span className="material-symbols-rounded text-primary mt-0.5 flex-shrink-0" aria-hidden="true">my_location</span>
        <p className="text-sm text-on-surface">
          Zona de seguridad actualizada hace 2 minutos. Todos los refugios listados tienen suministro eléctrico.
        </p>
      </div>

      {/* Shelter cards */}
      <div className="flex flex-col gap-4">
        {shelters.map((shelter) => {
          const st = statusConfig[shelter.status];
          return (
            <article
              key={shelter.name}
              className="bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden hover:shadow-sm transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-base text-on-surface">{shelter.name}</h2>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-rounded text-sm" aria-hidden="true">location_on</span>
                      {shelter.address}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-on-surface-variant">Capacidad</p>
                    <p className="font-bold text-on-surface text-sm">{shelter.capacity}</p>
                  </div>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {shelter.services.map((s) => (
                    <span key={s} className="flex items-center gap-1 text-xs bg-surface-container px-3 py-1 rounded-full text-on-surface-variant">
                      <span className="material-symbols-rounded text-sm" aria-hidden="true">{s}</span>
                      {serviceLabels[s]}
                    </span>
                  ))}
                </div>

                {/* Accessibility icons */}
                <div className="flex gap-2">
                  {shelter.features.map((f) => {
                    const filter = accessibilityFilters.find((af) => af.key === f);
                    return filter ? (
                      <span
                        key={f}
                        title={filter.label}
                        className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center"
                      >
                        <span className="material-symbols-rounded text-primary text-base" aria-label={filter.label}>{filter.icon}</span>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Card actions */}
              <div className="border-t border-outline-variant flex divide-x divide-outline-variant">
                <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-primary hover:bg-primary-fixed transition-colors">
                  <span className="material-symbols-rounded text-base" aria-hidden="true">directions</span>
                  Cómo llegar ahora
                </button>
                <button type="button" className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-rounded text-base" aria-hidden="true">bookmark_add</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
