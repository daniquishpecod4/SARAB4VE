import Link from "next/link";

const organizations = [
  {
    type: "ong",
    icon: "corporate_fare",
    name: "Fundación Apoyo Inclusivo",
    description: "Logística de evacuación y acompañamiento especializado para personas con discapacidad motriz.",
    services: ["Movilidad", "Evacuación", "Traslado"],
    volunteers: 48,
    distance: "1.7 km",
    active: true,
  },
  {
    type: "voluntarios",
    icon: "volunteer_activism",
    name: "Red de Voluntarios SARA — Zona Este",
    description: "120 voluntarios capacitados disponibles para apoyo inmediato y coordinación de rescates.",
    services: ["Apoyo General", "Primeros Auxilios"],
    volunteers: 120,
    distance: "900 m",
    active: true,
  },
  {
    type: "salud",
    icon: "medical_services",
    name: "Centro de Salud Chacao",
    description: "Atención médica accesible con guardia 24/7, rampas y personal especializado en discapacidades.",
    services: ["Atención Médica", "Medicamentos", "Traslado"],
    volunteers: 0,
    distance: "350 m",
    active: true,
  },
  {
    type: "logistica",
    icon: "shield_with_heart",
    name: "Centro Logístico SARA",
    description: "Coordinación central de suministros y comunicaciones para la red de respuesta en emergencias.",
    services: ["Logística", "Suministros", "Comunicación"],
    volunteers: 25,
    distance: "2.3 km",
    active: false,
  },
];

const typeConfig: Record<string, { label: string; color: string }> = {
  ong: { label: "ONG", color: "bg-secondary-fixed text-secondary" },
  voluntarios: { label: "Voluntarios", color: "bg-primary-fixed text-primary" },
  salud: { label: "Salud", color: "bg-error-container text-error" },
  logistica: { label: "Logística", color: "bg-surface-container-high text-on-surface-variant" },
};

export default function DirectorioPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Directorio de Organizaciones</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Conecta con organizaciones y voluntarios activos en tu zona.
          </p>
        </div>
        <Link
          href="/registro?tipo=organizacion"
          className="flex-shrink-0 flex items-center gap-2 border border-outline text-on-surface px-4 py-2.5 rounded-full font-semibold text-sm hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-rounded text-base" aria-hidden="true">add</span>
          Registrar
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" aria-hidden="true">search</span>
        <input
          type="search"
          placeholder="Buscar organización o servicio..."
          className="w-full rounded-xl border border-outline-variant bg-surface-container-low pl-12 pr-4 py-3 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { label: "Organizaciones", value: "4", icon: "corporate_fare" },
          { label: "Voluntarios activos", value: "193", icon: "group" },
          { label: "Servicios", value: "12", icon: "category" },
          { label: "Cobertura", value: "8 km", icon: "radar" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex flex-col gap-1">
            <span className="material-symbols-rounded text-primary text-xl" aria-hidden="true">{stat.icon}</span>
            <p className="font-bold text-xl text-on-surface">{stat.value}</p>
            <p className="text-xs text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Organizations list */}
      <div className="flex flex-col gap-4">
        {organizations.map((org) => {
          const tc = typeConfig[org.type];
          return (
            <article
              key={org.name}
              className="bg-surface-container-low border border-outline-variant rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-rounded text-primary text-2xl" aria-hidden="true">{org.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-bold text-base text-on-surface">{org.name}</h2>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tc.color}`}>{tc.label}</span>
                    {org.active && (
                      <span className="text-xs font-semibold text-primary flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant leading-snug mb-3">{org.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {org.services.map((s) => (
                      <span key={s} className="text-xs bg-surface-container px-2.5 py-0.5 rounded-full text-on-surface-variant">{s}</span>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                    {org.volunteers > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-rounded text-xs" aria-hidden="true">group</span>
                        {org.volunteers} voluntarios
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-rounded text-xs" aria-hidden="true">location_on</span>
                      {org.distance}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-outline-variant">
                <Link
                  href="/chat"
                  className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-rounded text-base" aria-hidden="true">chat</span>
                  Contactar
                </Link>
                <button type="button" className="flex items-center gap-1.5 border border-outline text-on-surface px-4 py-2 rounded-full text-sm font-semibold hover:bg-surface-container transition-colors">
                  <span className="material-symbols-rounded text-base" aria-hidden="true">info</span>
                  Ver perfil
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
