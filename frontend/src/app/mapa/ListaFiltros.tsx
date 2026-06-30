import { AccessibilityTag } from "@/types";
import { CONFIGURACION_ACCESIBILIDAD } from "@/mocks/refugios";

interface ListaFiltrosProps {
    activeFilters: Set<AccessibilityTag>;
    onToggle: (key: AccessibilityTag) => void;
    /** Si es true, los botones se muestran como íconos compactos (sidebar colapsado en desktop) */
    compacto?: boolean;
}

export function ListaFiltros({ activeFilters, onToggle, compacto = false }: ListaFiltrosProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {CONFIGURACION_ACCESIBILIDAD.map((f) => {
                const activo = activeFilters.has(f.key);
                return (
                    <button
                        key={f.key}
                        onClick={() => onToggle(f.key)}
                        aria-pressed={activo}
                        title={f.label}
                        className={`flex items-center transition-all duration-150 shrink-0 ${
                            compacto
                                ? "w-8 h-8 rounded-full justify-center mx-auto"
                                : "gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-semibold text-left"
                        } ${
                            activo
                                ? "bg-primary text-on-primary shadow-sm"
                                : "bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-low"
                        }`}
                    >
                        <span className="material-symbols-rounded text-lg" aria-hidden="true">
                            {f.icon}
                        </span>
                        {!compacto && <span className="flex-1 text-left">{f.label}</span>}
                        {!compacto && activo && (
                            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-primary" aria-hidden="true">
                                <span className="material-symbols-rounded text-[14px] font-bold">check</span>
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
