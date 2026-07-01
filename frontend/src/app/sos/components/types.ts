export type DisabilityType = "visual" | "auditiva" | "neuro" | "motriz";
export type CommunicationMode = "lengua_senas" | "audifono" | "implante_coclear" | "vibrador_oseo";
export type LocationStatus = "idle" | "loading" | "ready" | "error";

export const disabilityOptions: Array<{ id: DisabilityType; title: string; icon: string; hint: string }> = [
  {
    id: "visual",
    title: "Visual",
    icon: "visibility_off",
    hint: "Priorizar guia por voz y apoyo presencial.",
  },
  {
    id: "auditiva",
    title: "Auditiva",
    icon: "hearing_disabled",
    hint: "Canales de comunicacion accesibles para sordera o hipoacusia.",
  },
  {
    id: "neuro",
    title: "Neuro",
    icon: "neurology",
    hint: "Comunicacion clara, ambiente calmado y acompanamiento.",
  },
  {
    id: "motriz",
    title: "Motriz",
    icon: "accessible",
    hint: "Apoyo para movilidad, traslado y evacuacion accesible.",
  },
];

export const communicationOptions: Array<{ id: CommunicationMode; label: string; icon: string }> = [
  { id: "lengua_senas", label: "Lengua de senas", icon: "sign_language" },
  { id: "audifono", label: "Uso audifono", icon: "hearing" },
  { id: "implante_coclear", label: "Implante coclear", icon: "graphic_eq" },
  { id: "vibrador_oseo", label: "Vibrador oseo", icon: "vibration" },
];
