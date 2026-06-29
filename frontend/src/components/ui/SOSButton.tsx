import Link from "next/link";

interface SOSButtonProps {
  /** Override del href para el botón SOS. Por defecto "/sos" */
  sosHref?: string;
  /** Override del href para el mapa. Por defecto "/mapa" */
  mapHref?: string;
}

/**
 * Botón central de emergencia SARA — diseño split FAB del prototipo Stitch.
 * Parte izquierda: dispara el flujo SOS.
 * Parte derecha: accede directamente al mapa.
 */
export default function SOSButton({
  sosHref = "/sos",
  mapHref = "/mapa",
}: SOSButtonProps) {
  return (
    <div
      className="flex rounded-full shadow-lg overflow-hidden w-full max-w-sm mx-auto"
      role="group"
      aria-label="Acciones de emergencia"
    >
      {/* SOS principal */}
      <Link
        href={sosHref}
        className="flex-1 flex items-center justify-center gap-3 bg-secondary-container text-on-secondary px-6 py-4 font-bold text-lg hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary-container/50"
        aria-label="Necesito ayuda — abrir formulario de emergencia"
      >
        <span className="material-symbols-rounded text-2xl" aria-hidden="true">
          crisis_alert
        </span>
        <span>NECESITO AYUDA</span>
      </Link>

      {/* Divider visual */}
      <div className="w-px bg-on-secondary/30" aria-hidden="true" />

      {/* Mapa rápido */}
      <Link
        href={mapHref}
        className="flex items-center justify-center px-5 bg-primary text-on-primary hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
        aria-label="Ver mapa de puntos de auxilio"
      >
        <span className="material-symbols-rounded text-2xl" aria-hidden="true">
          map
        </span>
      </Link>
    </div>
  );
}
