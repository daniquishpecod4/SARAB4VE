import Link from "next/link";

const categories = [
  {
    id: "movilidad",
    icon: "accessible",
    label: "Movilidad",
    color: "bg-primary-fixed text-primary",
  },
  {
    id: "sensorial",
    icon: "visibility_off",
    label: "Sensorial",
    color: "bg-secondary-fixed text-secondary",
  },
  {
    id: "cognitiva",
    icon: "psychology",
    label: "Cognitiva",
    color: "bg-surface-container-high text-on-surface",
  },
  {
    id: "comunicacion",
    icon: "interpreter_mode",
    label: "Comunicación",
    color: "bg-tertiary-fixed text-tertiary",
  },
];

const resources = [
  {
    category: "movilidad",
    icon: "accessible",
    title: "Evacuación para movilidad reducida",
    description: "Guía paso a paso para traslado seguro con silla de ruedas o muletas en situaciones de emergencia.",
    tags: ["Movilidad", "Evacuación"],
    readTime: "5 min",
  },
  {
    category: "sensorial",
    icon: "visibility_off",
    title: "Comunicación accesible en crisis",
    description: "Protocolos para personas sordas, ciegas o con desafíos del habla. Incluye pictogramas imprimibles.",
    tags: ["Sensorial", "Comunicación"],
    readTime: "8 min",
  },
  {
    category: "cognitiva",
    icon: "psychology",
    title: "Regulación emocional en emergencias",
    description: "Técnicas simples para reducir ansiedad durante eventos críticos. Adaptado para perfiles neurodivergentes.",
    tags: ["Cognitiva", "Bienestar"],
    readTime: "6 min",
  },
  {
    category: "comunicacion",
    icon: "interpreter_mode",
    title: "Señas de emergencia básicas",
    description: "15 señas esenciales en Lengua de Señas Venezolana para situaciones de ayuda y coordinación.",
    tags: ["LSV", "Comunicación"],
    readTime: "10 min",
  },
  {
    category: "movilidad",
    icon: "escalator",
    title: "Rutas de evacuación accesibles",
    description: "Mapas y descripciones de rutas libres de escaleras para los principales sectores urbanos.",
    tags: ["Movilidad", "Mapas"],
    readTime: "4 min",
  },
  {
    category: "cognitiva",
    icon: "checklist",
    title: "Kit de emergencia para familias",
    description: "Lista visual y checklist adaptable para preparar un kit de emergencia con todos los tipos de necesidades.",
    tags: ["Cognitiva", "Preparación"],
    readTime: "3 min",
  },
];

export default function RecursosPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Recursos de Guía</h1>
        <p className="text-on-surface-variant mt-2">
          Protocolos de evacuación y apoyo adaptados a diferentes necesidades cognitivas, sensoriales y motrices.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button type="button" className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-primary text-on-primary">
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-rounded text-base" aria-hidden="true">{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Resources grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((r) => {
          const cat = categories.find((c) => c.id === r.category);
          return (
            <article
              key={r.title}
              className="group flex flex-col bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden hover:shadow-sm transition-all hover:-translate-y-0.5"
            >
              <div className={`px-5 py-4 flex items-center gap-3 ${cat?.color ?? "bg-surface-container text-on-surface"}`}>
                <span className="material-symbols-rounded text-2xl" aria-hidden="true">{r.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wide">{r.tags[0]}</span>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <h2 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">{r.title}</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed flex-1">{r.description}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant">
                  <div className="flex gap-1.5 flex-wrap">
                    {r.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-surface-container px-2.5 py-0.5 rounded-full text-on-surface-variant">{tag}</span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-on-surface-variant flex-shrink-0">
                    <span className="material-symbols-rounded text-sm" aria-hidden="true">schedule</span>
                    {r.readTime}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-2xl bg-primary-fixed border border-outline-variant p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="font-bold text-on-surface">¿Conoces un recurso que debería estar aquí?</h2>
          <p className="text-sm text-on-surface-variant mt-1">Ayúdanos a mejorar la guía enviando materiales accesibles.</p>
        </div>
        <Link
          href="/registro?tipo=voluntario"
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <span className="material-symbols-rounded text-base" aria-hidden="true">upload</span>
          Contribuir
        </Link>
      </div>
    </div>
  );
}
