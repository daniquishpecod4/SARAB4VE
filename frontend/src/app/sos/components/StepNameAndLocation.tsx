import { type LocationStatus } from "./types";

interface StepNameAndLocationProps {
  requesterName: string;
  extraInfo: string;
  locationStatus: LocationStatus;
  locationError: string;
  onRequesterNameChange: (value: string) => void;
  onExtraInfoChange: (value: string) => void;
  onRetryLocation: () => void;
}

export default function StepNameAndLocation({
  requesterName,
  extraInfo,
  locationStatus,
  locationError,
  onRequesterNameChange,
  onExtraInfoChange,
  onRetryLocation,
}: StepNameAndLocationProps) {
  return (
    <section aria-labelledby="step-3-title" className="max-w-3xl w-full mx-auto">
      <h2 id="step-3-title" className="text-xl font-bold text-on-surface">3) Nombre y ubicacion</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-semibold text-on-surface">
          Nombre o alias
          <input
            value={requesterName}
            onChange={(event) => onRequesterNameChange(event.target.value)}
            className="min-h-11 rounded-xl border border-outline bg-surface px-3"
            placeholder="Ej. Maria"
            autoComplete="name"
          />
        </label>

        <label className="sm:col-span-2 flex flex-col gap-1 text-sm font-semibold text-on-surface">
          Informacion o referencia de ubicacion (opcional)
          <input
            value={extraInfo}
            onChange={(event) => onExtraInfoChange(event.target.value)}
            className="min-h-11 rounded-xl border border-outline bg-surface px-3"
            placeholder="Ej. Frente a la plaza Bolivar, edificio azul"
          />
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-outline-variant bg-surface p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-on-surface">Estado de ubicacion</p>
          <button
            type="button"
            onClick={onRetryLocation}
            className="min-h-9 rounded-lg border border-outline px-3 text-xs font-semibold text-on-surface"
          >
            Reintentar
          </button>
        </div>
        <p className="mt-2 text-sm text-on-surface-variant" aria-live="polite">
          {locationStatus === "loading" && "Obteniendo ubicacion exacta..."}
          {locationStatus === "ready" && "Ubicacion lista para enviar SOS."}
          {locationStatus === "error" && (locationError || "No se pudo obtener la ubicacion.")}
          {locationStatus === "idle" && "Aun no se ha solicitado la ubicacion."}
        </p>
      </div>
    </section>
  );
}
