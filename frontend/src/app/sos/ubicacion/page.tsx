import Link from "next/link";

export default function SOSUbicacionPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span className="material-symbols-rounded text-base" aria-hidden="true">chevron_right</span>
        <Link href="/sos" className="hover:text-primary transition-colors">Solicitud</Link>
        <span className="material-symbols-rounded text-base" aria-hidden="true">chevron_right</span>
        <span className="text-on-surface font-medium">Ubicación y detalles</span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold">
          <span className="material-symbols-rounded text-sm" aria-hidden="true">check</span>
        </div>
        <div className="flex-1 h-1 rounded-full bg-primary" />
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold">2</div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Paso 2 de 2</p>
        <h1 className="text-2xl font-bold text-on-surface">Ubicación y detalles</h1>
        <p className="text-on-surface-variant mt-2">
          Comparte tu ubicación y agrega detalles para mejorar la coordinación del rescate.
        </p>
      </div>

      <form className="flex flex-col gap-5">
        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface" htmlFor="address">
            Dirección o referencia
          </label>
          <div className="relative">
            <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" aria-hidden="true">location_on</span>
            <input
              id="address"
              type="text"
              autoComplete="street-address"
              placeholder="Ej: Av. Francisco de Miranda, frente a la plaza"
              className="w-full rounded-xl border border-outline-variant bg-surface-container-low pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Urgency */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface" htmlFor="urgency">
            Nivel de urgencia
          </label>
          <select
            id="urgency"
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-on-surface focus:border-primary focus:outline-none transition-colors"
          >
            <option value="alta">Alta — Peligro inmediato</option>
            <option value="media">Media — Necesidad urgente sin peligro inmediato</option>
            <option value="baja">Baja — Necesidad estable</option>
          </select>
        </div>

        {/* People count */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface" htmlFor="people">
            Número de personas que necesitan ayuda
          </label>
          <input
            id="people"
            type="number"
            min={1}
            defaultValue={1}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-on-surface focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface" htmlFor="notes">
            Notas adicionales
          </label>
          <textarea
            id="notes"
            rows={4}
            placeholder="Ej: Estoy con una persona en silla de ruedas y un menor. La entrada norte está bloqueada."
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            type="submit"
            formAction="/chat"
            className="flex-1 flex items-center justify-center gap-2 bg-secondary-container text-on-secondary px-6 py-4 rounded-full font-bold text-base hover:opacity-90 transition-opacity focus-visible:outline-3 focus-visible:outline-primary"
          >
            <span className="material-symbols-rounded" aria-hidden="true">send</span>
            Enviar Solicitud
          </button>
          <Link
            href="/sos"
            className="flex-1 flex items-center justify-center gap-2 border border-outline text-on-surface px-6 py-4 rounded-full font-semibold text-base hover:bg-surface-container transition-colors focus-visible:outline-3 focus-visible:outline-primary"
          >
            <span className="material-symbols-rounded text-lg" aria-hidden="true">arrow_back</span>
            Volver
          </Link>
        </div>
      </form>
    </div>
  );
}
