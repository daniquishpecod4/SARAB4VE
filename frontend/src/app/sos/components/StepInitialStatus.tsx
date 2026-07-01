interface StepInitialStatusProps {
  isInjured: boolean | null;
  cannotMove: boolean | null;
  onInjuredChange: (value: boolean) => void;
  onCannotMoveChange: (value: boolean) => void;
}

export default function StepInitialStatus({
  isInjured,
  cannotMove,
  onInjuredChange,
  onCannotMoveChange,
}: StepInitialStatusProps) {
  return (
    <section aria-labelledby="step-1-title" className="max-w-3xl w-full mx-auto">
      <h2 id="step-1-title" className="text-xl font-bold text-on-surface">1) Estado inicial</h2>
      <p className="mt-1 text-sm text-on-surface-variant">Responde rapido para priorizar riesgo.</p>
      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-outline p-3">
          <p className="text-sm font-semibold text-on-surface mb-3">Tienes alguna herida?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onInjuredChange(true)}
              className={`min-h-12 flex-1 rounded-xl border px-4 py-2 text-sm font-bold ${isInjured === true ? "border-error bg-error text-on-error" : "border-outline bg-surface text-on-surface"}`}
            >
              Si
            </button>
            <button
              type="button"
              onClick={() => onInjuredChange(false)}
              className={`min-h-12 flex-1 rounded-xl border px-4 py-2 text-sm font-bold ${isInjured === false ? "border-primary bg-primary text-on-primary" : "border-outline bg-surface text-on-surface"}`}
            >
              No
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-outline p-3">
          <p className="text-sm font-semibold text-on-surface mb-3">Puedes moverte por tu cuenta?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onCannotMoveChange(false)}
              className={`min-h-12 flex-1 rounded-xl border px-4 py-2 text-sm font-bold ${cannotMove === false ? "border-primary bg-primary text-on-primary" : "border-outline bg-surface text-on-surface"}`}
            >
              Si
            </button>
            <button
              type="button"
              onClick={() => onCannotMoveChange(true)}
              className={`min-h-12 flex-1 rounded-xl border px-4 py-2 text-sm font-bold ${cannotMove === true ? "border-error bg-error text-on-error" : "border-outline bg-surface text-on-surface"}`}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
