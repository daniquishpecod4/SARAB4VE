export default function PerfilPage() {
  return (
    <section className="px-5 lg:px-10 py-8 lg:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-on-surface">Perfil</h1>
        <p className="text-on-surface-variant mt-2">
          Configura datos de contacto, necesidades de apoyo y preferencias de accesibilidad.
        </p>

        <div className="mt-6 rounded-2xl border border-outline-variant bg-surface-container-low p-6 grid gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-on-surface-variant">Nombre</p>
            <p className="font-semibold text-on-surface">Sara Perez</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-on-surface-variant">Telefono de emergencia</p>
            <p className="font-semibold text-on-surface">+58 412 000 0000</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-on-surface-variant">Necesidades registradas</p>
            <p className="font-semibold text-on-surface">Movilidad reducida · Comunicacion asistida</p>
          </div>
        </div>
      </div>
    </section>
  );
}
