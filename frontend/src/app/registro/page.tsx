interface RegistroPageProps {
  searchParams?: Promise<{ tipo?: string }>;
}

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const params = (await searchParams) ?? {};
  const tipo = params.tipo === "organizacion" ? "organizacion" : "voluntario";

  return (
    <section className="px-5 lg:px-10 py-8 lg:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-on-surface">
          Registro {tipo === "organizacion" ? "de Organizacion" : "de Voluntario"}
        </h1>
        <p className="text-on-surface-variant mt-2">
          Formulario inicial para unirte a la red SARA.
        </p>

        <form className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-6">
          <input className="rounded-xl border border-outline-variant bg-background px-4 py-3" placeholder="Nombre" />
          <input className="rounded-xl border border-outline-variant bg-background px-4 py-3" placeholder="Telefono" />
          <input className="rounded-xl border border-outline-variant bg-background px-4 py-3" placeholder="Municipio" />
          <button
            type="submit"
            className="rounded-full bg-primary text-on-primary px-6 py-3 font-semibold"
          >
            Enviar solicitud
          </button>
        </form>
      </div>
    </section>
  );
}
