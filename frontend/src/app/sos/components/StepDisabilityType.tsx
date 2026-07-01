import {
  communicationOptions,
  disabilityOptions,
  type CommunicationMode,
  type DisabilityType,
} from "./types";

interface StepDisabilityTypeProps {
  disabilityType: DisabilityType | null;
  communicationMode: CommunicationMode | null;
  onDisabilityTypeChange: (value: DisabilityType) => void;
  onCommunicationModeChange: (value: CommunicationMode) => void;
}

export default function StepDisabilityType({
  disabilityType,
  communicationMode,
  onDisabilityTypeChange,
  onCommunicationModeChange,
}: StepDisabilityTypeProps) {
  return (
    <section aria-labelledby="step-2-title" className="max-w-3xl w-full mx-auto">
      <h2 id="step-2-title" className="text-xl font-bold text-on-surface">2) Tipo de discapacidad</h2>
      <p className="mt-1 text-sm text-on-surface-variant">Selecciona la prioridad para adaptar la asistencia.</p>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {disabilityOptions.map((option) => (
          <button
            type="button"
            key={option.id}
            onClick={() => onDisabilityTypeChange(option.id)}
            className={`text-left min-h-14 rounded-2xl border px-4 py-3 ${disabilityType === option.id ? "border-primary bg-primary-fixed" : "border-outline bg-surface"}`}
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-rounded text-xl text-primary mt-0.5" aria-hidden="true">{option.icon}</span>
              <div>
                <p className="font-bold text-on-surface">{option.title}</p>
                <p className="text-xs text-on-surface-variant mt-1">{option.hint}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {disabilityType === "auditiva" && (
        <div className="mt-4 rounded-2xl border border-outline p-3">
          <p className="text-sm font-semibold text-on-surface mb-2">Subcategoria de comunicacion</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {communicationOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onCommunicationModeChange(option.id)}
                className={`min-h-11 rounded-xl border px-3 py-2 text-left text-sm font-semibold ${communicationMode === option.id ? "border-primary bg-primary-fixed" : "border-outline bg-surface"}`}
              >
                <span className="material-symbols-rounded align-middle mr-1 text-primary" aria-hidden="true">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
