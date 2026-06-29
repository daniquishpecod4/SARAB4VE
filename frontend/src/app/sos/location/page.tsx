import Link from "next/link";
import ClientForm from "./ClientForm";

export default function SOSUbicacionPage({ searchParams }: { searchParams?: any }) {
  const initialNeed = (searchParams?.need_type as string) || "";

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-10 py-8 lg:py-12">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span className="material-symbols-rounded text-base" aria-hidden="true">chevron_right</span>
        <Link href="/sos" className="hover:text-primary transition-colors">Solicitud</Link>
        <span className="material-symbols-rounded text-base" aria-hidden="true">chevron_right</span>
        <span className="text-on-surface font-medium">Ubicación y detalles</span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold">
          <span className="material-symbols-rounded text-sm" aria-hidden="true">check</span>
        </div>
        <div className="flex-1 h-1 rounded-full bg-primary" />
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-bold">2</div>
      </div>

      <div className="mb-8">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Paso 2 de 2</p>
        <h1 className="text-2xl font-bold text-on-surface">Ubicación y detalles</h1>
        <p className="text-on-surface-variant mt-2">Comparte tu ubicación y agrega detalles para mejorar la coordinación del rescate.</p>
      </div>

      <ClientForm initialNeed={initialNeed} />
    </div>
  );
}
