"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { alertService, type AlertMessage, type AlertType } from "@/services/alertService";

type AlertViewConfig = {
  icon: string;
  title: string;
  containerClass: string;
  iconClass: string;
  chipClass: string;
  progressClass: string;
};

const alertStyles: Record<AlertType, AlertViewConfig> = {
  info: {
    icon: "info",
    title: "Información",
    containerClass: "border-primary/35 bg-primary-fixed text-on-surface",
    iconClass: "text-primary",
    chipClass: "bg-primary/15 text-primary",
    progressClass: "bg-primary",
  },
  success: {
    icon: "check_circle",
    title: "Completado",
    containerClass:
      "border-[color:var(--color-success)] bg-[color:var(--color-success-container)] text-[color:var(--color-on-success-container)]",
    iconClass: "text-[color:var(--color-success)]",
    chipClass: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
    progressClass: "bg-[color:var(--color-success)]",
  },
  warning: {
    icon: "warning",
    title: "Atención",
    containerClass:
      "border-[color:var(--color-warning)] bg-[color:var(--color-warning-container)] text-[color:var(--color-on-warning-container)]",
    iconClass: "text-[color:var(--color-warning)]",
    chipClass: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",
    progressClass: "bg-[color:var(--color-warning)]",
  },
  error: {
    icon: "error",
    title: "Error",
    containerClass: "border-error bg-error-container text-on-error-container",
    iconClass: "text-error",
    chipClass: "bg-error/15 text-error",
    progressClass: "bg-error",
  },
};

export default function AlertsHost() {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const timers = timersRef.current;

    const unsubscribe = alertService.subscribe((alert) => {
      setAlerts((current) => [...current, alert]);
      const durationMs = alert.durationMs ?? 4000;
      const timeout = window.setTimeout(() => {
        setAlerts((current) => current.filter((item) => item.id !== alert.id));
        timers.delete(alert.id);
      }, durationMs);

      timers.set(alert.id, timeout);
    });

    return () => {
      unsubscribe();
      timers.forEach((timeout) => window.clearTimeout(timeout));
      timers.clear();
    };
  }, []);

  const visibleAlerts = useMemo(() => alerts.slice(-4).reverse(), [alerts]);

  const dismissAlert = (id: string) => {
    const timeout = timersRef.current.get(id);
    if (timeout) {
      window.clearTimeout(timeout);
      timersRef.current.delete(id);
    }
    setAlerts((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="pointer-events-none fixed right-4 bottom-24 lg:bottom-6 z-50 w-[calc(100%-2rem)] max-w-sm space-y-2">
      {visibleAlerts.map((alert) => {
        const style = alertStyles[alert.type];
        const durationMs = alert.durationMs ?? 4000;

        return (
          <div
            key={alert.id}
            role="alert"
            aria-live="polite"
            className={`pointer-events-auto overflow-hidden rounded-2xl border shadow-card backdrop-blur-sm animate-[fadein_160ms_ease-out] ${style.containerClass}`}
          >
            <div className="flex items-start gap-3 px-4 pt-3 pb-3">
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style.chipClass}`}>
                <span className={`material-symbols-rounded text-lg ${style.iconClass}`} aria-hidden="true">
                  {style.icon}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{style.title}</p>
                <p className="mt-0.5 text-sm font-medium leading-5">{alert.message}</p>
              </div>

              <button
                type="button"
                onClick={() => dismissAlert(alert.id)}
                className="pointer-events-auto -mr-1 -mt-1 rounded-full p-1 opacity-70 transition hover:opacity-100"
                aria-label="Cerrar notificación"
              >
                <span className="material-symbols-rounded text-lg" aria-hidden="true">close</span>
              </button>
            </div>

            <div className="h-1 w-full bg-black/5">
              <div
                className={`h-full ${style.progressClass} animate-[toastShrink_linear_forwards]`}
                style={{ animationDuration: `${durationMs}ms` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
