"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryCard from "@/components/ui/CategoryCard";
import ApplicantForm, { type SOSFormValues } from "./components/ApplicantForm";
import { alertService } from "@/services/alertService";
import { sendHelpRequest } from "@/api/helpRequests";

const categories = [
  {
    id: "equipment",
    icon: "accessible",
    title: "Equipamiento",
    description: "Sillas de ruedas, muletas, bastones, audífonos, etc.",
  },
  {
    id: "medication",
    icon: "medical_services",
    title: "Medicación",
    description: "Medicamentos recetados o de emergencia.",
  },
  {
    id: "transport",
    icon: "directions_car",
    title: "Transporte",
    description: "Traslado accesible a centros de salud, refugios u otros destinos.",
  },
  {
    id: "companionship",
    icon: "groups",
    title: "Acompañamiento",
    description: "Apoyo presencial o remoto para personas con discapacidad.",
  },
  {
    id: "interpreter",
    icon: "translate",
    title: "Intérpretes",
    description: "Interpretación en lengua de señas u otros idiomas.",
  },
  {
    id: "accessible_information",
    icon: "info",
    title: "Información Accesible",
    description: "Material en braille, lectura fácil, audio, lengua de señas.",
  },
  {
    id: "neurodivergent_support",
    icon: "psychiatry",
    title: "Apoyo para Personas Neurodivergentes",
    description: "Entornos tranquilos, comunicación clara y ajustes sensoriales.",
  },
];

export default function SOSPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SOSFormValues>({
    requester_name: "",
    contact_method: "phone",
    contact_value: "",
    need_type: "",
    description: "",
    urgency: "medium",
    address: "",
    people: 1,
  });
  // Step 1 only selects category; Step 2 (`/sos/ubicacion`) will collect details.

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: name === "people" ? Number(value) : value }));
  };

  const getCurrentPosition = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (!navigator?.geolocation) return reject(new Error("Geolocation no disponible"));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return "Por favor intenta de nuevo.";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.requester_name || !form.contact_method || !form.contact_value || !form.need_type) {
      alertService.warning("Por favor completa los campos requeridos.");
      setLoading(false);
      return;
    }

    let latitude: number | null = null;
    let longitude: number | null = null;
    try {
      const pos = await getCurrentPosition();
      latitude = pos.latitude;
      longitude = pos.longitude;
    } catch (error) {
      console.warn("No se pudo obtener geolocalización:", error);
      alertService.info("No pudimos obtener tu ubicación exacta. La solicitud se enviará con la dirección que escribiste.");
    }

    const payload = {
      requesterName: form.requester_name,
      contactMethod: form.contact_method,
      contactValue: form.contact_value,
      needType: form.need_type,
      description: form.description,
      latitude,
      longitude,
      urgency: form.urgency,
    };

    try {
      await sendHelpRequest(payload);
      alertService.success("Solicitud enviada. Gracias.");
      router.push("/");
    } catch (error) {
      alertService.error(`Error al enviar la solicitud: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span className="material-symbols-rounded text-base" aria-hidden="true">chevron_right</span>
        <span className="text-on-surface font-medium">Solicitud de Ayuda</span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === 1 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>1</div>
        <div className="flex-1 h-1 rounded-full bg-outline-variant">
          <div className={`h-full rounded-full ${step > 1 ? 'w-full bg-primary' : 'w-0'}`} />
        </div>
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === 2 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>2</div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-rounded text-on-secondary text-xl" aria-hidden="true">emergency_home</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Paso {step} de 2</p>
            <h1 className="text-2xl font-bold text-on-surface">{step === 1 ? '¿Qué necesitas ahora mismo?' : 'Ubicación y detalles'}</h1>
          </div>
        </div>
        <p className="text-on-surface-variant">
          {step === 1
            ? 'Selecciona el tipo de apoyo que requieres. Esto nos ayudará a conectar con el recurso adecuado de forma urgente.'
            : 'Proporciona la ubicación y detalles de la solicitud para que podamos enviar ayuda lo antes posible.'}
        </p>
      </div>

      {step === 1 && (
        <>
          {/* Categories */}
          <div className="flex flex-col gap-3">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                icon={cat.icon}
                title={cat.title}
                description={cat.description}
                selected={selected === cat.id}
                onClick={() => setSelected(cat.id)}
              />
            ))}
          </div>

          {/* Actions: pasar a paso 2 (Ubicación y Detalles) */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 border border-outline text-on-surface px-6 py-4 rounded-full font-semibold text-base hover:bg-surface-container transition-colors focus-visible:outline-3 focus-visible:outline-primary"
            >
              <span className="material-symbols-rounded text-lg" aria-hidden="true">close</span>
              Cancelar Solicitud
            </Link>
            <button
              onClick={() => {
                if (!selected) {
                  alertService.warning("Selecciona primero un tipo de necesidad.");
                  return;
                }
                setForm((current) => ({ ...current, need_type: selected }));
                setStep(2);
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-secondary-container text-on-secondary px-6 py-4 rounded-full font-bold text-base hover:opacity-90 transition-opacity focus-visible:outline-3 focus-visible:outline-primary"
            >
              Continuar
              <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="mt-4">
          <ApplicantForm
            form={form}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            loading={loading}
            onBack={() => setStep(1)}
          />
        </div>
      )}

      {/* Nearby banner */}
      <div className="mt-8 rounded-2xl bg-primary-fixed border border-outline-variant p-4 flex items-start gap-3">
        <span className="material-symbols-rounded text-primary text-2xl mt-0.5" aria-hidden="true">map</span>
        <div>
          <h2 className="font-semibold text-on-surface text-sm">Cerca de ti</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">
            <span className="material-symbols-rounded text-xs align-middle mr-1" aria-hidden="true">location_on</span>
            Hay <strong>3 puntos de auxilio accesibles</strong> identificados en tu zona actual.
          </p>
        </div>
      </div>
    </div>
  );
}
