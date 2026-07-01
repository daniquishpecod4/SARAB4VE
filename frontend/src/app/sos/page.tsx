"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { sendHelpRequest } from "@/api/helpRequests";
import { alertService } from "@/services/alertService";
import StepDisabilityType from "./components/StepDisabilityType";
import StepInitialStatus from "./components/StepInitialStatus";
import StepNameAndLocation from "./components/StepNameAndLocation";
import { type CommunicationMode, type DisabilityType, type LocationStatus } from "./components/types";

function mapNeedType(disabilityType: DisabilityType): string {
  switch (disabilityType) {
    case "visual":
      return "accessible_information";
    case "auditiva":
      return "interpreter";
    case "neuro":
      return "neurodivergent_support";
    case "motriz":
      return "transport";
    default:
      return "companionship";
  }
}

function mapUrgency(isInjured: boolean, cannotMove: boolean): "medium" | "high" | "critical" {
  if (isInjured || cannotMove) {
    return "critical";
  }

  return "high";
}

const FALLBACK_EMERGENCY_COORDINATES = {
  latitude: 10.4806,
  longitude: -66.9036,
};

export default function SOSFlowPage() {
  const [isInjured, setIsInjured] = useState<boolean | null>(null);
  const [cannotMove, setCannotMove] = useState<boolean | null>(null);
  const [disabilityType, setDisabilityType] = useState<DisabilityType | null>(null);
  const [communicationMode, setCommunicationMode] = useState<CommunicationMode | null>(null);
  const [requesterName, setRequesterName] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationError, setLocationError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const TOTAL_STEPS = 3;

  const requestLocation = () => {
    if (!navigator?.geolocation) {
      setLocationStatus("error");
      setLocationError("Tu dispositivo no permite geolocalizacion.");
      return;
    }

    setLocationStatus("loading");
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationStatus("ready");
      },
      () => {
        setLocationStatus("error");
        setLocationError("Activa la ubicacion para enviar SOS y vuelve a intentar.");
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const goToStep = (nextStep: number) => {
    if (nextStep === currentStep || nextStep < 1 || nextStep > TOTAL_STEPS) {
      return;
    }

    setIsTransitioning(true);
    window.setTimeout(() => {
      setCurrentStep(nextStep);
      setIsTransitioning(false);
    }, 140);
  };

  const description = useMemo(() => {
    const hasManualReference = extraInfo.trim().length > 3;
    const hasGeolocation = latitude !== null && longitude !== null && locationStatus === "ready";
    const blocks = [
      `Estado inicial: herido=${isInjured ? "si" : "no"}; movilidad_reducida=${cannotMove ? "si" : "no"}.`,
      `Discapacidad prioritaria: ${disabilityType ?? "no definida"}.`,
      disabilityType === "auditiva" ? `Subcategoria comunicacion: ${communicationMode ?? "sin definir"}.` : null,
      extraInfo.trim() ? `Info adicional: ${extraInfo.trim()}.` : null,
      hasManualReference && !hasGeolocation ? "Ubicacion enviada con referencia manual (sin GPS)." : null,
    ].filter(Boolean);

    return blocks.join(" ");
  }, [cannotMove, communicationMode, disabilityType, extraInfo, isInjured, latitude, locationStatus, longitude]);

  const progress = useMemo(() => Math.round((currentStep / TOTAL_STEPS) * 100), [currentStep]);

  const canContinueStep1 = isInjured !== null && cannotMove !== null;
  const canContinueStep2 = disabilityType !== null && (disabilityType !== "auditiva" || communicationMode !== null);
  const hasGeolocation = latitude !== null && longitude !== null && locationStatus === "ready";
  const hasManualReference = extraInfo.trim().length > 3;
  const canContinueStep3 = hasGeolocation || hasManualReference;

  const canSubmit =
    isInjured !== null &&
    cannotMove !== null &&
    disabilityType !== null &&
    (disabilityType !== "auditiva" || communicationMode !== null) &&
    (hasGeolocation || hasManualReference);

  const handleContinue = () => {
    if (currentStep === 1 && !canContinueStep1) {
      alertService.warning("Marca tu estado inicial para continuar.");
      return;
    }

    if (currentStep === 2 && !canContinueStep2) {
      alertService.warning("Selecciona el tipo de discapacidad y subcategoria si aplica.");
      return;
    }

    if (currentStep === 3 && !canContinueStep3) {
      alertService.warning("Activa ubicacion o agrega una referencia en informacion para enviar el SOS.");
      return;
    }

    if (currentStep === TOTAL_STEPS) {
      submitSOS();
      return;
    }

    goToStep(currentStep + 1);
  };

  const submitSOS = async () => {
    if (!canSubmit || !disabilityType || isInjured === null || cannotMove === null) {
      alertService.warning("Faltan datos clave para enviar tu SOS.");
      return;
    }

    const finalRequesterName = requesterName.trim() || "Persona en emergencia";
    const finalLatitude = hasGeolocation ? latitude : FALLBACK_EMERGENCY_COORDINATES.latitude;
    const finalLongitude = hasGeolocation ? longitude : FALLBACK_EMERGENCY_COORDINATES.longitude;

    setSubmitting(true);

    try {
      await sendHelpRequest({
        requesterName: finalRequesterName,
        contactMethod: "onsite",
        contactValue: finalRequesterName,
        needType: mapNeedType(disabilityType),
        description,
        latitude: finalLatitude,
        longitude: finalLongitude,
        urgency: mapUrgency(isInjured, cannotMove),
      });

      setSent(true);
      alertService.success("SOS enviado. Mantente en un lugar seguro.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo enviar el SOS.";
      alertService.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <main className="h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] px-4 pt-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-4 flex items-start lg:items-center justify-center" aria-live="polite">
        <div className="w-full max-w-3xl rounded-3xl border border-outline-variant bg-primary-fixed p-6 lg:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            <span className="material-symbols-rounded text-base" aria-hidden="true">check_circle</span>
            SOS recibido
          </div>
          <h1 className="mt-4 text-3xl font-bold text-on-surface">Tu solicitud ya esta en la red SARA</h1>
          <p className="mt-3 text-on-surface-variant text-base leading-relaxed">
            Ya notificamos a voluntarios y puntos de apoyo cercanos. Si puedes, permanece en un lugar seguro y visible.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href="/mapa"
              className="min-h-14 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-bold text-on-primary hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-rounded" aria-hidden="true">map</span>
              Ver mapa de apoyo
            </Link>
            <Link
              href="/"
              className="min-h-14 inline-flex items-center justify-center gap-2 rounded-2xl border border-outline px-5 py-3 font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-rounded" aria-hidden="true">home</span>
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] px-4 pt-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-4 flex items-start lg:items-center justify-center" aria-labelledby="sos-title">
      <section className="w-full max-w-4xl h-full max-h-[760px] rounded-3xl border border-outline-variant bg-surface-container-low shadow-xl flex flex-col overflow-hidden">
        <header className="px-4 lg:px-6 pt-4 lg:pt-5 pb-3 border-b border-outline-variant">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-error/10 px-3 py-1 text-xs font-semibold text-error">
                <span className="material-symbols-rounded text-sm" aria-hidden="true">emergency</span>
                Modo emergencia
              </div>
              <h1 id="sos-title" className="mt-2 text-2xl lg:text-3xl font-black text-on-surface">Solicitud SOS accesible</h1>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant">Paso {currentStep}/{TOTAL_STEPS}</p>
          </div>
          <div className="mt-3 h-2 rounded-full bg-surface-container-high overflow-hidden" aria-label="Progreso">
            <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </header>

        <div className={`flex-1 px-2 lg:px-2 flex flex-col justify-center overflow transition-all duration-150 ${isTransitioning ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0"}`}>
          {currentStep === 1 && (
            <StepInitialStatus
              isInjured={isInjured}
              cannotMove={cannotMove}
              onInjuredChange={setIsInjured}
              onCannotMoveChange={setCannotMove}
            />
          )}

          {currentStep === 2 && (
            <StepDisabilityType
              disabilityType={disabilityType}
              communicationMode={communicationMode}
              onDisabilityTypeChange={setDisabilityType}
              onCommunicationModeChange={setCommunicationMode}
            />
          )}

          {currentStep === 3 && (
            <StepNameAndLocation
              requesterName={requesterName}
              extraInfo={extraInfo}
              locationStatus={locationStatus}
              locationError={locationError}
              onRequesterNameChange={setRequesterName}
              onExtraInfoChange={setExtraInfo}
              onRetryLocation={requestLocation}
            />
          )}

        </div>

        <footer className="px-4 lg:px-6 py-3 border-t border-outline-variant flex gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => goToStep(currentStep - 1)}
              className="flex-1 min-h-12 rounded-xl border border-outline font-semibold text-on-surface"
            >
              Atras
            </button>
          ) : (
            <Link
              href="/"
              className="flex-1 min-h-12 rounded-xl border border-outline font-semibold text-on-surface inline-flex items-center justify-center"
            >
              Cancelar
            </Link>
          )}

          <button
            type="button"
            onClick={handleContinue}
            disabled={submitting || (currentStep === TOTAL_STEPS && !canSubmit)}
            className="flex-1 min-h-12 rounded-xl bg-primary text-on-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === TOTAL_STEPS ? (submitting ? "Enviando SOS..." : "Enviar SOS") : "Continuar"}
          </button>
        </footer>
      </section>
    </main>
  );
}
