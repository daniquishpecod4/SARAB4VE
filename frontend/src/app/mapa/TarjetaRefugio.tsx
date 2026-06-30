import { iRefugio, AccessibilityTag, ServiceTag } from "@/types";
import { CONFIGURACION_ESTADO, CONFIGURACION_ACCESIBILIDAD, CONFIGURACION_SERVICIOS } from "@/mocks/refugios";

export function TarjetaRefugio({
    shelter,
    isSelected,
    onClick,
}: {
    shelter: iRefugio;
    isSelected: boolean;
    onClick: () => void;
}) {
    const status = CONFIGURACION_ESTADO[shelter.status];
    return (
        <button
            onClick={onClick}
            className={`w-full text-left rounded-2xl border transition-all duration-150 focus-visible:outline-3 focus-visible:outline-primary p-4 ${isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-outline-variant bg-surface-container-lowest hover:border-primary/40 hover:shadow-sm"
                }`}
            aria-pressed={isSelected}
            aria-label={`${shelter.name}, ${status.label}, a ${shelter.distance}`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-primary" : "bg-surface-container-high"
                        }`}
                >
                    <span
                        className={`material-symbols-rounded text-xl ${isSelected ? "text-on-primary" : "text-on-surface-variant"
                            }`}
                        aria-hidden="true"
                    >
                        emergency_home
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-on-surface truncate">{shelter.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                            {status.label}
                        </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">{shelter.address}</p>
                </div>
                <span className="text-xs font-semibold text-primary shrink-0 mt-0.5">
                    {shelter.distance}
                </span>
            </div>

            {(shelter.tags.length > 0 || shelter.services.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {shelter.tags.slice(0, 3).map((tag) => {
                        const f = CONFIGURACION_ACCESIBILIDAD.find((f) => f.key === tag)!;
                        return (
                            <span
                                key={tag}
                                className="flex items-center gap-1 bg-primary-fixed text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            >
                                <span className="material-symbols-rounded text-[12px]" aria-hidden="true">
                                    {f.icon}
                                </span>
                                {f.label.split(" ")[0]}
                            </span>
                        );
                    })}
                    {shelter.services.map((svc) => (
                        <span
                            key={svc}
                            className="bg-surface-container-high text-on-surface-variant text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        >
                            {CONFIGURACION_SERVICIOS[svc]}
                        </span>
                    ))}
                </div>
            )}

            {isSelected && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                    <a
                        href={`https://www.openstreetmap.org/directions?from=&to=${shelter.lat},${shelter.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary rounded-xl py-2.5 text-sm font-bold hover:opacity-90 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="material-symbols-rounded text-lg" aria-hidden="true">
                            directions
                        </span>
                        Cómo llegar ahora
                    </a>
                </div>
            )}
        </button>
    );
}