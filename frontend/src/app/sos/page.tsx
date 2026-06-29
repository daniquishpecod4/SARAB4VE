"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CategoryCard from "@/components/ui/CategoryCard";

const categories = [
  {
    id: "medica",
    icon: "medical_services",
    title: "Asistencia Médica",
    description: "Primeros auxilios, medicinas urgentes o traslado médico accesible.",
  },
  {
    id: "movilidad",
    icon: "accessible",
    title: "Ayuda de Movilidad",
    description: "Sillas de ruedas, muletas o apoyo físico para evacuación segura.",
  },
  {
    id: "alimento",
    icon: "restaurant",
    title: "Agua y Alimento",
    description: "Suministros básicos adaptados a necesidades dietéticas específicas.",
  },
  {
    id: "refugio",
    icon: "night_shelter",
    title: "Refugio Seguro",
    description: "Espacios con accesibilidad garantizada para pernocta o resguardo.",
  },
  {
    id: "psicosocial",
    icon: "psychiatry",
    title: "Apoyo Psicosocial",
    description: "Intervención en crisis, apoyo emocional o comunicación asistida.",
  },
  {
    id: "otro",
    icon: "help_center",
    title: "Otro Apoyo",
    description: "Describe una necesidad específica no listada anteriormente.",
  },
];

export default function SOSPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

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
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold">1</div>
        <div className="flex-1 h-1 rounded-full bg-outline-variant">
          <div className="w-0 h-full rounded-full bg-primary" />
        </div>
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold">2</div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-rounded text-on-secondary text-xl" aria-hidden="true">emergency_home</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Paso 1 de 2</p>
            <h1 className="text-2xl font-bold text-on-surface">¿Qué necesitas ahora mismo?</h1>
          </div>
        </div>
        <p className="text-on-surface-variant">
          Selecciona el tipo de apoyo que requieres. Esto nos ayudará a conectar
          con el recurso adecuado de forma urgente.
        </p>
      </div>

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

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push("/sos/ubicacion")}
          disabled={!selected}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary-container text-on-secondary px-6 py-4 rounded-full font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity focus-visible:outline-3 focus-visible:outline-primary"
        >
          Continuar
          <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
        </button>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 border border-outline text-on-surface px-6 py-4 rounded-full font-semibold text-base hover:bg-surface-container transition-colors focus-visible:outline-3 focus-visible:outline-primary"
        >
          <span className="material-symbols-rounded text-lg" aria-hidden="true">close</span>
          Cancelar Solicitud
        </Link>
      </div>

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
