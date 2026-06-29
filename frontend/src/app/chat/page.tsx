import Link from "next/link";

const conversations = [
  {
    id: "maria",
    name: "Coord. María López",
    role: "Coordinadora de zona",
    lastMessage: "Confirmando punto de encuentro...",
    time: "14:20",
    unread: 1,
    online: true,
    icon: "person",
  },
  {
    id: "grupo",
    name: "Grupo Apoyo Zona Norte",
    role: "Grupo · 8 miembros",
    lastMessage: "Ruta accesible verificada para mañana.",
    time: "12:05",
    unread: 0,
    online: false,
    icon: "group",
  },
  {
    id: "dr-ricardo",
    name: "Dr. Ricardo — Salud",
    role: "Médico voluntario",
    lastMessage: "¿Pudiste revisar los medicamentos?",
    time: "Ayer",
    unread: 0,
    online: false,
    icon: "medical_services",
  },
  {
    id: "centro-logistico",
    name: "Centro Logístico SARA",
    role: "Centro de operaciones",
    lastMessage: "Nueva actualización de suministros.",
    time: "Lun",
    unread: 0,
    online: true,
    icon: "shield_with_heart",
  },
];

const messages = [
  {
    from: "other",
    name: "Coord. María López",
    text: "Hola, estamos coordinando la entrega de suministros de mañana. ¿Tu ubicación actual sigue siendo segura y accesible para sillas de ruedas?",
    time: "14:15",
    status: null,
  },
  {
    from: "me",
    name: "Tú",
    text: "Sí, la rampa de acceso sur está despejada. Pueden llegar por la calle lateral sin problemas.",
    time: "14:18",
    status: "Entregado",
  },
  {
    from: "other",
    name: "Coord. María López",
    text: "Confirmando punto de encuentro...",
    time: "14:20",
    status: null,
  },
];

export default function ChatPage() {
  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-4rem-5rem)] lg:h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-0 overflow-hidden">
      {/* Sidebar — conversation list */}
      <aside className="hidden lg:flex flex-col w-80 flex-shrink-0 border-r border-outline-variant bg-surface-container-low">
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-outline-variant flex items-center justify-between">
          <h1 className="font-bold text-base text-on-surface">Mensajes</h1>
          <button type="button" className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors">
            <span className="material-symbols-rounded text-xl" aria-hidden="true">edit_note</span>
          </button>
        </div>
        {/* Search */}
        <div className="px-3 py-2 border-b border-outline-variant">
          <div className="relative">
            <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none" aria-hidden="true">search</span>
            <input
              type="search"
              placeholder="Buscar conversación..."
              className="w-full rounded-xl bg-surface-container pl-9 pr-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
            />
          </div>
        </div>
        {/* List */}
        <ul className="flex-1 overflow-y-auto divide-y divide-outline-variant" role="list">
          {conversations.map((conv, i) => (
            <li key={conv.id}>
              <button
                type="button"
                className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-surface-container transition-colors text-left ${i === 0 ? "bg-primary-fixed" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-rounded text-on-surface-variant text-xl" aria-hidden="true">{conv.icon}</span>
                  </div>
                  {conv.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary border-2 border-surface-container-low" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-sm text-on-surface truncate">{conv.name}</span>
                    <span className="text-xs text-on-surface-variant flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Chat header */}
        <header className="px-4 py-3 border-b border-outline-variant bg-surface-container-low flex items-center gap-3">
          <Link href="/" className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant">
            <span className="material-symbols-rounded text-xl" aria-hidden="true">arrow_back</span>
          </Link>
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-rounded text-on-surface-variant text-xl" aria-hidden="true">person</span>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary border-2 border-surface-container-low" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm text-on-surface">Coord. María López</h2>
            <p className="text-xs text-primary">En línea</p>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" aria-label="Llamada de voz">
              <span className="material-symbols-rounded text-xl" aria-hidden="true">call</span>
            </button>
            <button type="button" className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" aria-label="Videollamada">
              <span className="material-symbols-rounded text-xl" aria-hidden="true">videocam</span>
            </button>
            <button type="button" className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" aria-label="Ver perfil">
              <span className="material-symbols-rounded text-xl" aria-hidden="true">person</span>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-background">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[78%] ${msg.from === "me" ? "ml-auto items-end" : "items-start"}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.from === "me"
                    ? "bg-primary text-on-primary rounded-br-sm"
                    : "bg-surface-container text-on-surface rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1.5 mt-1 px-1">
                <span className="text-xs text-on-surface-variant">{msg.time}</span>
                {msg.status && (
                  <span className="text-xs text-on-surface-variant flex items-center gap-0.5">
                    <span className="material-symbols-rounded text-xs" aria-hidden="true">done_all</span>
                    {msg.status}
                  </span>
                )}
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            María está escribiendo...
          </div>
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-outline-variant bg-surface-container-low">
          <p className="text-xs text-on-surface-variant text-center mb-2">Presiona Enter para enviar o usa el dictado por voz</p>
          <form className="flex items-end gap-2">
            <button type="button" className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors" aria-label="Adjuntar archivo">
              <span className="material-symbols-rounded text-xl" aria-hidden="true">add_circle</span>
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="w-full rounded-2xl border border-outline-variant bg-surface-container px-4 py-2.5 pr-12 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <button type="button" className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors" aria-label="Dictado por voz">
              <span className="material-symbols-rounded text-xl" aria-hidden="true">mic</span>
            </button>
            <button type="submit" className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary hover:opacity-90 transition-opacity" aria-label="Enviar mensaje">
              <span className="material-symbols-rounded text-xl" aria-hidden="true">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
