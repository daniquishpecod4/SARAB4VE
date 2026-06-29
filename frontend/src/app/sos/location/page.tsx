"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SOSUbicacionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialNeed = searchParams.get("need_type") || "";

  const [form, setForm] = useState({
    requester_name: "",
    contact_method: "phone",
    contact_value: "",
    need_type: initialNeed,
    description: "",
    urgency: "media",
    address: "",
    people: 1,
  });

  useEffect(() => {
    if (initialNeed) setForm((s) => ({ ...s, need_type: initialNeed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNeed]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: name === "people" ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.requester_name || !form.contact_method || !form.contact_value || !form.need_type) {
      alert("Por favor completa los campos requeridos.");
      return;
    }

    // TODO: enviar al backend
    console.log("Enviar solicitud SOS:", form);
    alert("Solicitud enviada. Gracias.");
    router.push("/sos");
  };

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span className="material-symbols-rounded text-base" aria-hidden="true">chevron_right</span>
        <Link href="/sos" className="hover:text-primary transition-colors">Solicitud</Link>
        <span className="material-symbols-rounded text-base" aria-hidden="true">chevron_right</span>
        <span className="text-on-surface font-medium">Ubicación y detalles</span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold">
          <span className="material-symbols-rounded text-sm" aria-hidden="true">check</span>
        </div>
        <div className="flex-1 h-1 rounded-full bg-primary" />
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold">2</div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Paso 2 de 2</p>
        <h1 className="text-2xl font-bold text-on-surface">Ubicación y detalles</h1>
        <p className="text-on-surface-variant mt-2">
          Comparte tu ubicación y agrega detalles para mejorar la coordinación del rescate.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Requester */}
        <div>
          <label className="text-sm font-semibold text-on-surface mb-1">Nombre o identificación</label>
          <input name="requester_name" value={form.requester_name} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5" placeholder="Tu nombre" required />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-on-surface mb-1">Método de contacto</label>
            <select name="contact_method" value={form.contact_method} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5" required>
              <option value="">Seleccionar</option>
              <option value="phone">Teléfono</option>
              <option value="email">Correo electrónico</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-on-surface mb-1">Contacto</label>
            <input name="contact_value" value={form.contact_value} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5" placeholder="Número o email" required />
          </div>
        </div>

        {/* Need type */}
        {/* <div>
          <label className="text-sm font-semibold text-on-surface mb-1">Tipo de necesidad</label>
          <input name="need_type" value={form.need_type} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5" placeholder="Ej. Asistencia Médica" required />
        </div> */}

        {/* Address */}
        <div>
          <label className="text-sm font-semibold text-on-surface mb-1">Dirección o referencia</label>
          <div className="relative">
            <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" aria-hidden="true">location_on</span>
            <input name="address" value={form.address} onChange={handleChange} type="text" autoComplete="street-address" placeholder="Ej: Av. Francisco de Miranda, frente a la plaza" className="w-full rounded-xl border border-outline-variant bg-surface-container-low pl-12 pr-4 py-3.5" />
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="text-sm font-semibold text-on-surface mb-1">Nivel de urgencia</label>
          <select name="urgency" value={form.urgency} onChange={handleChange} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5">
            <option value="alta">Alta — Peligro inmediato</option>
            <option value="media">Media — Necesidad urgente sin peligro inmediato</option>
            <option value="baja">Baja — Necesidad estable</option>
          </select>
        </div>

        {/* People and description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-on-surface mb-1">Número de personas</label>
            <input name="people" value={String(form.people)} onChange={handleChange} type="number" min={1} className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5" />
          </div>
          <div>
            <label className="text-sm font-semibold text-on-surface mb-1">Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe la situación con mayor detalle" className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5 resize-none" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-secondary-container text-on-secondary px-6 py-4 rounded-full font-bold text-base hover:opacity-90 transition-opacity">
            <span className="material-symbols-rounded" aria-hidden="true">send</span>
            Enviar Solicitud
          </button>
          <Link href="/sos" className="flex-1 flex items-center justify-center gap-2 border border-outline text-on-surface px-6 py-4 rounded-full font-semibold text-base hover:bg-surface-container">
            <span className="material-symbols-rounded text-lg" aria-hidden="true">arrow_back</span>
            Volver
          </Link>
        </div>
      </form>
    </div>
  );
}
