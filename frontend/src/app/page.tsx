import Link from "next/link";
import PointCard from "@/components/ui/PointCard";

const nearbyPoints = [
  {
    icon: "emergency",
    title: "Centro de Salud Chacao",
    description: "Atención médica accesible · Rampas · Personal especializado",
    badge: "Abierto",
    distance: "350 m",
  },
  {
    icon: "night_shelter",
    title: "Refugio Municipal #3",
    description: "Espacios con accesibilidad garantizada para pernocta",
    badge: "Disponible",
    distance: "1.2 km",
  },
  {
    icon: "volunteer_activism",
    title: "Cruz Roja Venezolana",
    description: "Voluntarios activos — respuesta en menos de 15 min",
    distance: "800 m",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative bg-surface-container-low border-b border-outline-variant"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-5xl mx-auto px-5 lg:px-10 py-14 lg:py-24 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <span className="material-symbols-rounded text-base" aria-hidden="true">emergency_home</span>
              Plataforma de Emergencia Accesible
            </div>
            <h1
              id="hero-heading"
              className="text-[2rem] lg:text-5xl font-bold text-on-surface leading-tight tracking-tight"
            >
              Asistencia inmediata para personas con discapacidad
            </h1>
            <p className="mt-4 text-base lg:text-lg text-on-surface-variant max-w-lg mx-auto lg:mx-0">
              SARA facilita la comunicación, ayuda y el rescate en situaciones críticas. Para los afectados por el terremoto en Venezuela.
              Pulsa el botón central para alertar a los equipos de emergencia cercanos.
            </p>

            {/* Boton SOS de Emergencia */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/sos"
                className="flex items-center justify-center gap-3 bg-error text-on-error px-10 py-5 rounded-full font-extrabold text-2xl shadow-2xl hover:opacity-90 transition-all hover:scale-110 active:scale-100 focus-visible:outline-3 focus-visible:outline-error border-2 border-error-container animate-pulse"
              >
                <span className="material-symbols-rounded text-4xl" aria-hidden="true">emergency</span>
                SOS — Emergencia
              </Link>
            </div>

            <div className="mt-8 mx-2 lg:mx-1 flex flex-col sm:flex-row gap-3 justify-center lg:justify-around">
              {/* Boton de Solicitud de Apoyo */}
              <Link
                href="/request"
                className="flex items-center justify-center gap-3 bg-secondary-container text-on-secondary px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-100 focus-visible:outline-3 focus-visible:outline-primary"
              >
                <span className="material-symbols-rounded text-2xl" aria-hidden="true">crisis_alert</span>
                Solicitar Apoyo
              </Link>
              <Link
                href="/mapa"
                className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-4 rounded-full font-semibold text-base hover:opacity-90 transition-all hover:scale-[1.02] active:scale-100 focus-visible:outline-3 focus-visible:outline-primary"
              >
                <span className="material-symbols-rounded text-xl" aria-hidden="true">map</span>
                Ver mapa
              </Link>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 text-sm text-on-surface-variant">
              <span className="material-symbols-rounded text-base text-primary" aria-hidden="true">group</span>
              <span><strong className="text-on-surface">2,450 voluntarios</strong> activos hoy en la Red SARA</span>
            </div>
          </div>

          <div className="flex-shrink-0 w-full max-w-xs lg:max-w-sm">
            <div className="relative z-10 rounded-3xl bg-primary p-8 flex flex-col items-center gap-6 shadow-xl">
              <img src="/logo.webp" alt="SARA" className="h-20 w-auto brightness-0 invert" />
              <p className="text-on-primary/80 text-center text-sm font-medium">
                Sistema Autónomo de Respuesta y Asistencia
              </p>
              <div className="w-full flex flex-col gap-2">
                {[
                  { icon: "location_on", label: "3 puntos de auxilio cercanos" },
                  { icon: "volunteer_activism", label: "Voluntarios en menos de 15 min" },
                  { icon: "accessible", label: "100% accesible" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
                    <span className="material-symbols-rounded text-on-primary/80 text-lg" aria-hidden="true">{icon}</span>
                    <span className="text-on-primary text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 lg:px-10 py-12" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="features-heading" className="text-2xl font-bold text-on-surface mb-2">
            ¿Qué puedes encontrar?
          </h2>
          <p className="text-on-surface-variant mb-8">
            Recursos diseñados para situaciones de emergencia con accesibilidad garantizada.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "location_on",
                title: "Puntos Seguros",
                description: "Refugios accesibles y centros de asistencia médica cercanos.",
                href: "/refugios",
                bg: "bg-primary-fixed",
                fg: "text-primary",
              },
              {
                icon: "auto_stories",
                title: "Recursos de Guía",
                description: "Protocolos de evacuación para necesidades cognitivas y motrices.",
                href: "/recursos",
                bg: "bg-secondary-fixed",
                fg: "text-secondary",
              },
              {
                icon: "corporate_fare",
                title: "Directorio",
                description: "Organizaciones y voluntarios activos en tu zona.",
                href: "/directorio",
                bg: "bg-surface-container-high",
                fg: "text-on-surface",
              },
            ].map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className={`group flex flex-col gap-4 p-6 rounded-2xl ${f.bg} hover:shadow-md transition-all hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-primary`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center ${f.fg}`}>
                  <span className="material-symbols-rounded text-2xl" aria-hidden="true">{f.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">{f.description}</p>
                </div>
                <span className="material-symbols-rounded text-on-surface-variant text-base mt-auto" aria-hidden="true">arrow_forward</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEARBY */}
      <section className="px-5 lg:px-10 py-10 bg-surface-container-low border-t border-outline-variant" aria-labelledby="nearby-heading">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-primary" aria-hidden="true">location_on</span>
              <h2 id="nearby-heading" className="text-xl font-bold text-on-surface">Cerca de ti</h2>
            </div>
            <Link href="/mapa" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
              Ver mapa
              <span className="material-symbols-rounded text-base" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
          <p className="text-sm text-on-surface-variant mb-5">
            Hay <strong>3 puntos de auxilio accesibles</strong> identificados en tu zona actual.
          </p>
          <div className="flex flex-col gap-3">
            {nearbyPoints.map((p) => (
              <PointCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* COLLAB CTA */}
      <section className="px-5 lg:px-10 py-12" aria-labelledby="collab-heading">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-primary p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">
            <div className="flex-1">
              <h2 id="collab-heading" className="text-2xl font-bold text-on-primary">
                ¿Quieres colaborar en la red de apoyo?
              </h2>
              <p className="text-on-primary/80 mt-2 text-base">
                Únete a los 2,450 voluntarios que ya forman parte de la Red SARA.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                href="/registro?tipo=voluntario"
                className="flex items-center justify-center gap-2 bg-on-primary text-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-primary-fixed transition-colors focus-visible:outline-3 focus-visible:outline-on-primary min-h-[48px]"
              >
                <span className="material-symbols-rounded text-lg" aria-hidden="true">volunteer_activism</span>
                Soy voluntario
              </Link>
              <Link
                href="/registro?tipo=organizacion"
                className="flex items-center justify-center gap-2 border-2 border-on-primary/50 text-on-primary px-6 py-3 rounded-full font-bold text-sm hover:border-on-primary transition-colors focus-visible:outline-3 focus-visible:outline-on-primary min-h-[48px]"
              >
                <span className="material-symbols-rounded text-lg" aria-hidden="true">corporate_fare</span>
                Soy organización
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
