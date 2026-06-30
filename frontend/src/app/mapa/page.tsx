"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { AccessibilityTag } from '@/types/index'
import { Refugios, CONFIGURACION_ACCESIBILIDAD, CONFIGURACION_SERVICIOS } from '@/mocks/refugios'
import { TarjetaRefugio } from '@/app/mapa/TarjetaRefugio'
import { EstadoVacio } from '@/app/mapa/EstadoVacio'

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-container-low">
      <div className="flex flex-col items-center gap-3 text-on-surface-variant">
        <span className="material-symbols-rounded text-4xl animate-pulse" aria-hidden="true">
          map
        </span>
        <p className="text-sm font-medium">Cargando mapa…</p>
      </div>
    </div>
  ),
});

export default function MapaPage() {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<AccessibilityTag>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleFilter = useCallback((key: AccessibilityTag) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const refugiosFiltrados = Refugios.filter((s) => {
    const coincideBusqueda =
      query.trim() === "" ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.sector.toLowerCase().includes(query.toLowerCase()) ||
      s.address.toLowerCase().includes(query.toLowerCase());
    const coincideFiltros =
      activeFilters.size === 0 || [...activeFilters].every((f) => s.tags.includes(f));
    return coincideBusqueda && coincideFiltros;
  });

  const refugioSeleccionado = Refugios.find((r) => r.id === selectedId) ?? null;

  const handleSeleccionar = (id: string | null) => {
    setSelectedId((prev) => (prev === id ? null : id));

    if (id) setMobileDrawerOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background relative">

      {/* ══════════════════════════════════════════════════
          DESKTOP SIDEBAR 
      ══════════════════════════════════════════════════ */}
      <aside
        className={`hidden lg:flex flex-col bg-surface border-r border-outline-variant transition-all duration-200 shrink-0 ${sidebarOpen ? "w-80 xl:w-96" : "w-14"
          } overflow-hidden`}
        aria-label="Panel de refugios"
      >
        {/* Cabecera */}
        <div className={`pt-4 pb-3 border-b border-outline-variant ${sidebarOpen ? "px-4" : "px-2"}`}>
          <div className={`flex items-center ${sidebarOpen ? "justify-between mb-3" : "justify-center mb-1"}`}>
            {sidebarOpen ? (
              <h1 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-rounded text-primary text-xl" aria-hidden="true">
                  emergency_home
                </span>
                Refugios Disponibles
              </h1>
            ) : null}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "Ocultar panel" : "Mostrar panel"}
              className="flex w-8 h-8 items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-rounded text-base text-on-surface-variant" aria-hidden="true">
                {sidebarOpen ? "chevron_left" : "chevron_right"}
              </span>
            </button>
          </div>

          {/* Buscador */}
          <div className="relative">
            {sidebarOpen ? (
              <>
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-rounded text-on-surface-variant text-lg pointer-events-none"
                  aria-hidden="true"
                >
                  search
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por ciudad o zona..."
                  aria-label="Buscar refugio por ciudad o zona"
                  className="w-full pl-9 pr-3 py-2.5 bg-surface-container rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <span className="material-symbols-rounded text-base text-on-surface-variant hover:text-on-surface" aria-hidden="true">
                      close
                    </span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir búsqueda"
                className="flex w-8 h-8 items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors mx-auto mt-2"
              >
                <span className="material-symbols-rounded text-lg">search</span>
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className={`py-3 border-b border-outline-variant ${sidebarOpen ? "px-4" : "px-2"}`}>
          {sidebarOpen ? (
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Filtros de Accesibilidad
            </p>
          ) : null}
          <div className="flex flex-col gap-1.5">
            {CONFIGURACION_ACCESIBILIDAD.map((f) => {
              const active = activeFilters.has(f.key);
              return (
                <button
                  key={f.key}
                  onClick={() => toggleFilter(f.key)}
                  aria-pressed={active}
                  title={f.label}
                  className={`flex items-center transition-all duration-150 shrink-0 ${sidebarOpen
                    ? "gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-semibold text-left"
                    : "w-8 h-8 rounded-full justify-center mx-auto"
                    } ${active
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-low"
                    }`}
                >
                  <span className="material-symbols-rounded text-lg" aria-hidden="true">{f.icon}</span>
                  {sidebarOpen ? <span className="flex-1 text-left">{f.label}</span> : null}
                  {sidebarOpen && active ? (
                    <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-primary" aria-hidden="true">
                      <span className="material-symbols-rounded text-[14px] font-bold">check</span>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de resultados o Detalle del Refugio - solo si está expandido */}
        {sidebarOpen ? (
          <div
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
            role="list"
            aria-label="Lista de refugios"
            aria-live="polite"
          >
            {selectedId && refugioSeleccionado ? (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setSelectedId(null)}
                  className="flex items-center gap-2 text-primary font-bold text-xs hover:opacity-80 transition-opacity self-start py-1 px-2 rounded-lg bg-primary/5 min-h-0"
                >
                  <span className="material-symbols-rounded text-sm">arrow_back</span>
                  Volver a la lista
                </button>
                <TarjetaDetalle refugio={refugioSeleccionado} />
              </div>
            ) : refugiosFiltrados.length === 0 ? (
              <EstadoVacio query={query} filtrosActivos={activeFilters} onLimpiar={() => { setQuery(""); setActiveFilters(new Set()); }} />
            ) : (
              <>
                <p className="text-xs text-on-surface-variant px-1 mb-1">
                  <strong className="text-on-surface">{refugiosFiltrados.length}</strong>{" "}
                  refugio{refugiosFiltrados.length !== 1 ? "s" : ""} encontrado{refugiosFiltrados.length !== 1 ? "s" : ""}
                </p>
                {refugiosFiltrados.map((s) => (
                  <div key={s.id} role="listitem">
                    <TarjetaRefugio
                      shelter={s}
                      isSelected={selectedId === s.id}
                      onClick={() => handleSeleccionar(s.id)}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        ) : null}
      </aside>

      {/* ══════════════════════════════════════════════════
          MAPA (ocupa todo en móvil, flex-1 en desktop)
      ══════════════════════════════════════════════════ */}
      <div className="flex-1 relative">
        <LeafletMap
          shelters={refugiosFiltrados}
          selectedId={selectedId}
          onSelect={handleSeleccionar}
        />

        {/* ── MOBILE: Buscador flotante encima del mapa ── */}

        <div className="lg:hidden absolute top-3 left-3 right-3 z-[1000] flex items-center gap-2">
          {/* Botón para abrir el drawer lateral en mobile */}
          <button
            onClick={() => setMobileDrawerOpen((v) => !v)}
            aria-label={mobileDrawerOpen ? "Cerrar panel" : "Abrir panel de refugios"}
            className="flex w-11 h-11 items-center justify-center bg-white border border-outline-variant rounded-xl shadow-md hover:bg-surface-container transition-colors shrink-0"
          >
            <span className="material-symbols-rounded text-xl text-on-surface">
              {mobileDrawerOpen ? "close" : "menu"}
            </span>
          </button>

          {/* Buscador compacto flotante */}
          <div className="relative flex-1">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-rounded text-on-surface-variant text-lg pointer-events-none"
              aria-hidden="true"
            >
              search
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar refugio..."
              aria-label="Buscar refugio"
              className="w-full pl-9 pr-9 py-2.5 bg-white rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant border border-outline-variant shadow-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <span className="material-symbols-rounded text-base text-on-surface-variant hover:text-on-surface" aria-hidden="true">
                  close
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ── MOBILE: Drawer lateral que se superpone al mapa ── */}
        {/* Overlay: solo cubre el área del mapa, no el navbar */}
        {mobileDrawerOpen && (
          <div
            className="lg:hidden absolute inset-0 z-[1500] bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Panel drawer lateral — ocupa el alto del contenedor (sin navbar) */}
        <div
          className={`lg:hidden absolute top-0 left-0 bottom-0 z-[1600] flex flex-col bg-surface shadow-2xl transition-all duration-300 ease-in-out ${mobileDrawerOpen ? "w-[85vw] max-w-sm" : "w-0"
            } overflow-hidden`}
          aria-label="Panel de refugios (móvil)"
        >
          {/* Cabecera del drawer */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-outline-variant shrink-0">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-rounded text-primary text-xl" aria-hidden="true">
                emergency_home
              </span>
              Refugios Disponibles
            </h2>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              aria-label="Cerrar panel"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-rounded text-base text-on-surface-variant">chevron_left</span>
            </button>
          </div>

          {/* Filtros de accesibilidad en el drawer */}
          <div className="px-4 py-3 border-b border-outline-variant shrink-0">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Filtros de Accesibilidad
            </p>
            <div className="flex flex-col gap-1.5">
              {CONFIGURACION_ACCESIBILIDAD.map((f) => {
                const active = activeFilters.has(f.key);
                return (
                  <button
                    key={f.key}
                    onClick={() => toggleFilter(f.key)}
                    aria-pressed={active}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${active
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-low"
                      }`}
                  >
                    <span className="material-symbols-rounded text-lg" aria-hidden="true">{f.icon}</span>
                    <span className="flex-1 text-left">{f.label}</span>
                    {active ? (
                      <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-primary" aria-hidden="true">
                        <span className="material-symbols-rounded text-[14px] font-bold">check</span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista de refugios en el drawer */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
            role="list"
            aria-label="Lista de refugios"
            aria-live="polite"
          >
            {refugiosFiltrados.length === 0 ? (
              <EstadoVacio query={query} filtrosActivos={activeFilters} onLimpiar={() => { setQuery(""); setActiveFilters(new Set()); }} />
            ) : (
              <>
                <p className="text-xs text-on-surface-variant px-1 mb-1">
                  <strong className="text-on-surface">{refugiosFiltrados.length}</strong>{" "}
                  refugio{refugiosFiltrados.length !== 1 ? "s" : ""} encontrado{refugiosFiltrados.length !== 1 ? "s" : ""}
                </p>
                {refugiosFiltrados.map((s) => (
                  <div key={s.id} role="listitem">
                    <TarjetaRefugio
                      shelter={s}
                      isSelected={selectedId === s.id}
                      onClick={() => handleSeleccionar(s.id)}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── MOBILE: Tarjeta de detalle flotante (bottom sheet) al seleccionar ── */}
        {selectedId && refugioSeleccionado && (
          <div className="lg:hidden absolute bottom-0 left-0 right-0 z-[1000] animate-slide-up">
            <div className="bg-surface rounded-t-3xl shadow-2xl border-t border-outline-variant overflow-hidden">
              {/* Handle / agarradera */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-outline-variant"></div>
              </div>
              {/* Botón cerrar */}
              <div className="flex items-center justify-between px-4 pb-2">
                <button
                  onClick={() => setSelectedId(null)}
                  className="flex items-center gap-1.5 text-primary font-bold text-xs hover:opacity-80 transition-opacity py-1 min-h-0"
                >
                  <span className="material-symbols-rounded text-sm">arrow_back</span>
                  Volver
                </button>
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
                  aria-label="Cerrar detalle"
                >
                  <span className="material-symbols-rounded text-base text-on-surface-variant">close</span>
                </button>
              </div>

              {/* Contenido de la tarjeta detallada */}
              <div className="px-4 pb-6">
                <TarjetaDetalle refugio={refugioSeleccionado} />
              </div>
            </div>
          </div>
        )}

        {/* ── Banner de seguridad flotante ── */}

        {showBanner && !selectedId && (
          <div className="absolute bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[900] w-[90%] sm:w-[480px] bg-[#1c1b1b] text-white rounded-xl px-4 py-3 flex items-center justify-between gap-3 shadow-lg border border-neutral-800">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-rounded text-lg text-amber-500 shrink-0 mt-0.5" aria-hidden="true">
                warning
              </span>
              <p className="text-xs font-medium leading-normal text-gray-200">
                Zona de seguridad actualizada hace 2 minutos. Todos los refugios listados tienen suministro eléctrico.
              </p>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Cerrar notificación"
            >
              <span className="material-symbols-rounded text-base" aria-hidden="true">close</span>
            </button>
          </div>
        )}
      </div>

      {/* Animación slide-up para el bottom sheet */}
      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

// ── Componente auxiliar: Tarjeta detallada del refugio seleccionado ─────────
function TarjetaDetalle({ refugio }: { refugio: NonNullable<ReturnType<typeof Refugios.find>> }) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-card">
      {/* Imagen */}
      <div className="relative h-40 w-full bg-surface-container-high">
        <img
          src={refugio.imagen || "/logo.webp"}
          alt={refugio.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "/logo.webp"; }}
        />
        {refugio.status === "activo" && (
          <div className="absolute top-3 right-3 bg-[#fc6018] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            Activo
          </div>
        )}
      </div>

      {/* Detalles */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h2 className="text-base font-bold text-on-surface leading-tight">{refugio.name}</h2>
          <div className="flex items-center gap-1 mt-1.5 text-on-surface-variant">
            <span className="material-symbols-rounded text-sm shrink-0">location_on</span>
            <span className="text-xs font-semibold">{refugio.address}</span>
          </div>
        </div>

        {/* Servicios */}
        {refugio.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {refugio.services.map((svc) => (
              <span
                key={svc}
                className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              >
                <span className="material-symbols-rounded text-[12px]">
                  {svc === "wifi" ? "wifi" : svc === "salud" ? "medical_services" : "restaurant"}
                </span>
                {CONFIGURACION_SERVICIOS[svc]}
              </span>
            ))}
          </div>
        )}

        {/* Botón Cómo llegar */}
        <a
          href={`https://www.openstreetmap.org/directions?from=&to=${refugio.lat},${refugio.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#0040a1] hover:bg-[#0056d2] text-white rounded-xl py-3 text-sm font-bold shadow-sm transition-colors mt-2"
        >
          <span className="material-symbols-rounded text-lg">directions</span>
          Cómo llegar ahora
        </a>
      </div>
    </div>
  );
}