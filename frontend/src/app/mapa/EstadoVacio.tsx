import { AccessibilityTag } from "@/types";

export function EstadoVacio({
    query,
    filtrosActivos,
    onLimpiar,
}: {
    query: string;
    filtrosActivos: Set<AccessibilityTag>;
    onLimpiar: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <span className="material-symbols-rounded text-4xl text-on-surface-variant" aria-hidden="true">
                search_off
            </span>
            <p className="text-sm text-on-surface-variant">
                No se encontraron refugios con esos criterios.
            </p>
            {(query || filtrosActivos.size > 0) && (
                <button
                    onClick={onLimpiar}
                    className="text-sm font-semibold text-primary hover:underline"
                >
                    Limpiar filtros
                </button>
            )}
        </div>
    );
}