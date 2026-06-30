
import { iRefugio, AccessibilityTag } from "@/types";
import { TarjetaRefugio } from "@/app/mapa/TarjetaRefugio";
import { EstadoVacio } from "@/app/mapa/EstadoVacio";

interface ListaRefugiosProps {
    refugios: iRefugio[];
    selectedId: string | null;
    query: string;
    filtrosActivos: Set<AccessibilityTag>;
    onSeleccionar: (id: string) => void;
    onLimpiar: () => void;
}

export function ListaRefugios({
    refugios,
    selectedId,
    query,
    filtrosActivos,
    onSeleccionar,
    onLimpiar,
}: ListaRefugiosProps) {
    if (refugios.length === 0) {
        return (
            <EstadoVacio
                query={query}
                filtrosActivos={filtrosActivos}
                onLimpiar={onLimpiar}
            />
        );
    }

    return (
        <>
            <p className="text-xs text-on-surface-variant px-1 mb-1">
                <strong className="text-on-surface">{refugios.length}</strong>{" "}
                refugio{refugios.length !== 1 ? "s" : ""} encontrado{refugios.length !== 1 ? "s" : ""}
            </p>
            {refugios.map((s) => (
                <div key={s.id} role="listitem">
                    <TarjetaRefugio
                        shelter={s}
                        isSelected={selectedId === s.id}
                        onClick={() => onSeleccionar(s.id)}
                    />
                </div>
            ))}
        </>
    );
}
