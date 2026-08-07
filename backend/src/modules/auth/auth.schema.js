/**
 * Esquema — schemas Zod + normalización para el dominio de auth.
 *
 * Cada DTO se define una sola vez como schema Zod. El mismo schema:
 *   1. Valida el request body en el controller (safeParse)
 *   2. Genera la documentación OpenAPI automáticamente (.openapi())
 *
 * Las funciones normalize* se conservan porque el servicio las necesita
 * para agregar campos derivados (role, status) antes del INSERT.
 */
const { z } = require("zod");
const { extendZodWithOpenApi } = require("@asteasolutions/zod-to-openapi");

// Extender Zod con el método .openapi() — requerido por zod-to-openapi v8+
extendZodWithOpenApi(z);

// ---------------------------------------------------------------------------
// Constantes (sin cambios)
// ---------------------------------------------------------------------------

/** Roles válidos en el sistema. */
const ROLES = ["citizen", "volunteer", "organization", "admin"];

/** Días de la semana aceptados para available_days. */
const VALID_DAYS = [
  "lunes",
  "martes",
  "miercoles",
  "miércoles",
  "jueves",
  "viernes",
  "sabado",
  "sábado",
  "domingo",
];

const VALID_DAYS_SET = new Set(VALID_DAYS);

/** Estados iniciales según el rol. */
const INITIAL_STATUS = {
  citizen: "approved",
  volunteer: "pending",
  organization: "pending",
  admin: "approved",
};

// ---------------------------------------------------------------------------
// Schemas reutilizables (sub-schemas compartidos entre DTOs)
// ---------------------------------------------------------------------------

/**
 * Coordenadas geográficas { lat, lng }.
 * Se usa como sub-schema en todos los DTOs de registro.
 */
const LocationSchema = z.object({
  lat: z.number()
    .min(-90, "location.lat debe ser una coordenada válida (-90 a 90)")
    .max(90, "location.lat debe ser una coordenada válida (-90 a 90)"),
  lng: z.number()
    .min(-180, "location.lng debe ser una coordenada válida (-180 a 180)")
    .max(180, "location.lng debe ser una coordenada válida (-180 a 180)"),
}).openapi({ description: "Coordenadas geográficas del usuario" });

/**
 * Campos comunes a todos los registros (fullName, email, phone, password,
 * location, zone). Se extiende con .extend() en cada DTO.
 */
const CommonFields = z.object({
  fullName: z.string()
    .min(1, "fullName es requerido")
    .openapi({ example: "María González", description: "Nombre completo" }),

  email: z.string()
    .min(1, "email es requerido")
    .email("email no tiene un formato válido")
    .openapi({ example: "maria@email.com", description: "Correo electrónico" }),

  phone: z.string()
    .min(1, "phone es requerido")
    .refine(
      (val) => /^\+?[0-9]{7,15}$/.test(val.replace(/[\s-]/g, "")),
      "phone no tiene un formato válido (mínimo 7 dígitos)",
    )
    .openapi({ example: "+584241234567", description: "Teléfono (formato internacional o local)" }),

  password: z.string()
    .min(8, "password debe tener al menos 8 caracteres")
    .openapi({ example: "unaClaveSegura2024!", description: "Contraseña (mín. 8 caracteres)" }),

  location: LocationSchema.nullable().optional()
    .openapi({ description: "Ubicación geográfica (opcional)" }),

  zone: z.string().optional()
    .openapi({ example: "Caracas - Zona 1", description: "Zona o sector (opcional)" }),
});

// ---------------------------------------------------------------------------
// POST /api/auth/register/citizen
// ---------------------------------------------------------------------------

const RegisterCitizenBody = CommonFields.extend({}).openapi({
  description: "Payload para registrar un ciudadano (aprobación automática)",
  example: {
    fullName: "María González",
    email: "maria@email.com",
    phone: "+584241234567",
    password: "unaClaveSegura2024!",
    location: { lat: 10.4806, lng: -66.9036 },
    zone: "Caracas - Zona 1",
  },
});

// ---------------------------------------------------------------------------
// POST /api/auth/register/volunteer
// ---------------------------------------------------------------------------

const RegisterVolunteerBody = CommonFields.extend({
  skills: z.array(z.string().min(1, "skills contiene valores vacíos"))
    .min(1, "skills es requerido y debe contener al menos una habilidad")
    .openapi({
      example: ["primeros_auxilios", "logistica", "traduccion_lsen"],
      description: "Habilidades del voluntario",
    }),

  availableHours: z.number()
    .int("availableHours debe ser un número entero")
    .min(1, "availableHours debe ser al menos 1")
    .max(168, "availableHours no puede exceder 168 (horas en una semana)")
    .openapi({ example: 20, description: "Horas disponibles por semana (1-168)" }),

  availableDays: z.array(
    z.string().refine((d) => VALID_DAYS_SET.has(d?.toLowerCase?.() ?? ""), {
      message: "availableDays contiene valores inválidos. Válidos: " + VALID_DAYS.join(", "),
    }),
  )
    .min(1, "availableDays es requerido y debe contener al menos un día")
    .openapi({
      example: ["lunes", "miercoles", "sabado"],
      description: "Días de la semana disponibles",
    }),

  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "acceptedTerms debe ser true para registrarse como voluntario" }),
  }).openapi({ example: true, description: "Debe ser true" }),

  // Nuevos campos de voluntarios
  documentNumber: z.string().min(1, "documentNumber es requerido")
    .openapi({ example: "12345678A", description: "Número de documento de identidad" }),
  birthDate: z.string().min(1, "birthDate es requerida")
    .openapi({ example: "1990-05-15", description: "Fecha de nacimiento (YYYY-MM-DD)" }),
  address: z.string().min(1, "address es requerida")
    .openapi({ example: "Calle Falsa 123", description: "Dirección de residencia" }),
  volunteerType: z.enum(["professional", "non_professional"])
    .openapi({ example: "professional", description: "Tipo de voluntario" }),
  profession: z.string().optional()
    .openapi({ example: "Médico", description: "Profesión o formación (opcional)" }),
  languages: z.array(z.string()).optional()
    .openapi({ example: ["Español", "Inglés"], description: "Idiomas (opcional)" }),
  experienceCategories: z.array(z.string()).optional()
    .openapi({ example: ["salud", "atencion_emergencias"], description: "Categorías de experiencia (opcional)" }),
  scheduleHours: z.array(z.number())
    .min(1, "scheduleHours debe contener al menos un bloque horario")
    .openapi({ example: [1, 2], description: "IDs de bloques horarios de disponibilidad" }),
  modalityPresential: z.boolean()
    .openapi({ example: true, description: "Disponibilidad presencial" }),
  modalityOnline: z.boolean()
    .openapi({ example: false, description: "Disponibilidad remota/online" }),
  interestAreas: z.array(z.string())
    .min(1, "interestAreas debe contener al menos un área de interés")
    .openapi({ example: ["salud", "rescate"], description: "Áreas de interés" }),
  hasPriorExperience: z.boolean().nullable().optional()
    .openapi({ example: true, description: "Si tiene experiencia previa en voluntariado" }),
}).openapi({
  description: "Payload para registrar un voluntario (requiere aprobación)",
  example: {
    fullName: "Carlos Pérez",
    email: "voluntario@sara.org",
    phone: "+584241112233",
    password: "claveSegura2024!",
    location: { lat: 10.4806, lng: -66.9036 },
    zone: "Caracas - Zona 1",
    documentNumber: "12345678A",
    birthDate: "1990-05-15",
    address: "Calle Falsa 123",
    volunteerType: "professional",
    profession: "Médico",
    skills: ["primeros_auxilios", "logistica"],
    availableHours: 20,
    availableDays: ["lunes", "miercoles", "sabado"],
    scheduleHours: [1, 2],
    modalityPresential: true,
    modalityOnline: false,
    interestAreas: ["salud", "rescate"],
    languages: ["Español", "Inglés"],
    experienceCategories: ["salud", "atencion_emergencias"],
    hasPriorExperience: true,
    acceptedTerms: true,
  },
});

// ---------------------------------------------------------------------------
// POST /api/auth/register/organization
// ---------------------------------------------------------------------------

const RegisterOrganizationBody = CommonFields.extend({
  organizationName: z.string()
    .min(1, "organizationName es requerido para organizaciones")
    .openapi({ example: "Cruz Roja Venezolana", description: "Nombre de la organización" }),

  legalDocument: z.string()
    .min(1, "legalDocument es requerido para organizaciones")
    .openapi({ example: "RIF-J-12345678-9", description: "Documento legal (RIF, cédula jurídica)" }),

  workArea: z.array(z.string().min(1, "workArea contiene valores vacíos"))
    .optional()
    .openapi({
      example: ["salud", "logistica", "alimentos"],
      description: "Áreas de trabajo (opcional)",
    }),

  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "acceptedTerms debe ser true para registrarse como organización" }),
  }).openapi({ example: true, description: "Debe ser true" }),

  // Nuevos campos de organización
  countryFiscal: z.string().min(1, "countryFiscal es requerido")
    .openapi({ example: "Venezuela", description: "País emisor del identificador fiscal" }),
  fiscalIdType: z.string().min(1, "fiscalIdType es requerido")
    .openapi({ example: "RIF", description: "Tipo de identificador fiscal" }),
  fiscalNumber: z.string().min(1, "fiscalNumber es requerido")
    .openapi({ example: "J-12345678-9", description: "Número de identificación fiscal" }),
  entityType: z.string().min(1, "entityType es requerido")
    .openapi({ example: "Asociación", description: "Tipo de entidad" }),
  otherEntityType: z.string().optional()
    .openapi({ example: "ONG internacional", description: "Otro tipo de entidad si aplica" }),
  registrationNumber: z.number().int().min(1, "registrationNumber es requerido")
    .openapi({ example: 4567, description: "Número de registro legal" }),
  constitutionDate: z.string().min(1, "constitutionDate es requerida")
    .openapi({ example: "1980-04-12", description: "Fecha de constitución (YYYY-MM-DD)" }),
  legalAddress: z.string().min(1, "legalAddress es requerida")
    .openapi({ example: "Av. Fuerzas Armadas, Caracas", description: "Dirección legal" }),
  legalCountry: z.string().min(1, "legalCountry es requerido")
    .openapi({ example: "Venezuela", description: "País de registro legal" }),
  province: z.string().min(1, "province es requerida")
    .openapi({ example: "Distrito Capital", description: "Provincia o estado" }),
  city: z.string().min(1, "city es requerida")
    .openapi({ example: "Caracas", description: "Ciudad" }),
  legalRepresentativeName: z.string().min(1, "legalRepresentativeName es requerido")
    .openapi({ example: "Juan Pérez", description: "Nombre del representante legal" }),
  legalRepresentativePosition: z.string().min(1, "legalRepresentativePosition es requerido")
    .openapi({ example: "Director General", description: "Cargo del representante legal" }),
  legalRepresentativePhone: z.string().min(1, "legalRepresentativePhone es requerido")
    .openapi({ example: "+584241234567", description: "Teléfono del representante legal" }),
  legalRepresentativeEmail: z.string().email("legalRepresentativeEmail inválido")
    .openapi({ example: "juan.perez@cruzroja.org.ve", description: "Email del representante legal" }),
  website: z.string().optional()
    .openapi({ example: "https://cruzroja.org.ve", description: "Sitio web de la organización" }),
  socialMedia: z.string().optional()
    .openapi({ example: "@cruzrojave", description: "Redes sociales de la organización" }),
  mission: z.string().min(1, "mission es requerida")
    .openapi({ example: "Aliviar el sufrimiento humano...", description: "Misión institucional" }),
  vision: z.string().min(1, "vision es requerida")
    .openapi({ example: "Ser líderes en la asistencia humanitaria...", description: "Visión institucional" }),
  scope: z.string().min(1, "scope es requerido")
    .openapi({ example: "Nacional", description: "Ámbito de acción territorial" }),
  collectiveServed: z.string().min(1, "collectiveServed es requerido")
    .openapi({ example: "Personas con discapacidad y adultos mayores", description: "Colectivo atendido" }),
  disabilityTypes: z.array(z.string()).min(1, "disabilityTypes debe contener al menos un tipo")
    .openapi({ example: ["visual", "motora"], description: "Tipos de discapacidad que atienden" }),
  services: z.string().min(1, "services es requerido")
    .openapi({ example: "Atención médica, talleres de capacitación...", description: "Servicios prestados" }),
}).openapi({
  description: "Payload para registrar una organización (requiere aprobación)",
  example: {
    fullName: "Ana Rodríguez",
    email: "contacto@cruzroja.org.ve",
    phone: "+582121234567",
    password: "claveOrg2024!",
    location: { lat: 10.4806, lng: -66.9036 },
    zone: "Caracas - Centro",
    organizationName: "Cruz Roja Venezolana",
    legalDocument: "RIF-J-12345678-9",
    workArea: ["salud", "logistica"],
    acceptedTerms: true,
    countryFiscal: "Venezuela",
    fiscalIdType: "RIF",
    fiscalNumber: "J-12345678-9",
    entityType: "Asociación",
    otherEntityType: "ONG nacional",
    registrationNumber: 4567,
    constitutionDate: "1980-04-12",
    legalAddress: "Av. Fuerzas Armadas, Caracas",
    legalCountry: "Venezuela",
    province: "Distrito Capital",
    city: "Caracas",
    legalRepresentativeName: "Juan Pérez",
    legalRepresentativePosition: "Director General",
    legalRepresentativePhone: "+582121234568",
    legalRepresentativeEmail: "juan.perez@cruzroja.org.ve",
    website: "https://cruzroja.org.ve",
    socialMedia: "@cruzrojave",
    mission: "Brindar apoyo humanitario y atención a la comunidad vulnerable.",
    vision: "Ser una red de respuesta efectiva y solidaria en todo el país.",
    scope: "Nacional",
    collectiveServed: "Personas con discapacidad y adultos mayores",
    disabilityTypes: ["visual", "motora"],
    services: "Atención médica, capacitación y logística de emergencia",
  },
});

// ---------------------------------------------------------------------------
// POST /api/auth/register/admin
// ---------------------------------------------------------------------------

const RegisterAdminBody = CommonFields.extend({
  adminSecret: z.string()
    .min(1, "adminSecret es requerido para registrar un administrador")
    .openapi({
      example: "******",
      description: "Secreto de administrador configurado en el servidor",
    }),
}).openapi({
  description: "Payload para registrar un administrador (protegido por ADMIN_SECRET)",
  example: {
    fullName: "Admin Principal",
    email: "admin@sara.org",
    phone: "+584249990000",
    password: "adminClaveSegura2024!",
    location: { lat: 10.4806, lng: -66.9036 },
    zone: "Caracas - Oficina Central",
    adminSecret: "******",
  },
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------

const LoginBody = z.object({
  email: z.string()
    .min(1, "email es requerido")
    .email("email no tiene un formato válido")
    .openapi({ example: "maria@email.com", description: "Correo electrónico registrado" }),

  password: z.string()
    .min(1, "password es requerido")
    .openapi({ example: "unaClaveSegura2024!", description: "Contraseña" }),
}).openapi({
  description: "Credenciales de inicio de sesión",
  example: {
    email: "maria@email.com",
    password: "unaClaveSegura2024!",
  },
});

// ---------------------------------------------------------------------------
// Schemas de respuesta (para documentación OpenAPI)
// ---------------------------------------------------------------------------

/** Envoltura estándar de error: { errors: [...] } */
const ErrorResponse = z.object({
  errors: z.array(z.string()).openapi({ example: ["email es requerido"] }),
}).openapi({ description: "Respuesta de error con lista de mensajes" });

/** Usuario sin password_hash (respuesta de registro y GET /me) */
const UserProfile = z.object({
  id: z.string().uuid().openapi({ example: "550e8400-e29b-41d4-a716-446655440000" }),
  full_name: z.string().openapi({ example: "María González" }),
  email: z.string().email().openapi({ example: "maria@email.com" }),
  phone: z.string().openapi({ example: "+584241234567" }),
  role: z.enum(ROLES).openapi({ example: "citizen" }),
  status: z.string().openapi({ example: "approved" }),
  location: LocationSchema.nullable().optional(),
  zone: z.string().nullable().optional().openapi({ example: "Caracas - Zona 1" }),
  phone_verified: z.boolean().openapi({ example: false }),
  email_verified: z.boolean().openapi({ example: false }),
  created_at: z.string().datetime().openapi({ example: "2024-01-15T10:30:00.000Z" }),
  updated_at: z.string().datetime().openapi({ example: "2024-01-15T10:30:00.000Z" }),
}).openapi({ description: "Perfil de usuario sin datos sensibles" });

/** Respuesta de login: { token, user } */
const LoginResponse = z.object({
  data: z.object({
    token: z.string().openapi({
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      description: "JWT para usar en Authorization: Bearer <token>",
    }),
    user: UserProfile,
  }),
}).openapi({ description: "Token JWT + perfil del usuario" });

// ---------------------------------------------------------------------------
// Normalizadores (SIN cambios — los servicios dependen de ellos)
// ---------------------------------------------------------------------------

/**
 * Normaliza el payload de registro de ciudadano para inserción en DB.
 * @param {Object} payload — ya validado por Zod
 * @returns {{ user: Object }}
 */
function normalizeRegisterCitizen(payload) {
  return {
    user: {
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim().replace(/[\s-]/g, ""),
      password: payload.password, // Se hashea en el servicio
      role: "citizen",
      status: "approved",
      location: payload.location || null,
      zone: payload.zone?.trim() || null,
    },
  };
}

/**
 * Normaliza el payload de registro de voluntario para inserción en DB.
 * @param {Object} payload — ya validado por Zod
 * @returns {{ user: Object, details: Object }}
 */
function normalizeRegisterVolunteer(payload) {
  return {
    user: {
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim().replace(/[\s-]/g, ""),
      password: payload.password,
      role: "volunteer",
      status: "pending",
      location: payload.location || null,
      zone: payload.zone?.trim() || null,
    },
    details: {
      skills: payload.skills.map((s) => s.trim()),
      availableHours: Number(payload.availableHours),
      availableDays: payload.availableDays.map((d) => d.toLowerCase().trim()),
      acceptedTerms: true,
      documentNumber: payload.documentNumber.trim(),
      birthDate: payload.birthDate,
      address: payload.address.trim(),
      volunteerType: payload.volunteerType,
      profession: payload.profession?.trim() || null,
      languages: payload.languages?.map((l) => l.trim()) || null,
      experienceCategories: payload.experienceCategories?.map((c) => c.trim()) || null,
      scheduleHours: payload.scheduleHours,
      modalityPresential: payload.modalityPresential,
      modalityOnline: payload.modalityOnline,
      interestAreas: payload.interestAreas.map((i) => i.trim()),
      hasPriorExperience: payload.hasPriorExperience,
    },
  };
}

/**
 * Normaliza el payload de registro de organización para inserción en DB.
 * @param {Object} payload — ya validado por Zod
 * @returns {{ user: Object, details: Object }}
 */
function normalizeRegisterOrganization(payload) {
  return {
    user: {
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim().replace(/[\s-]/g, ""),
      password: payload.password,
      role: "organization",
      status: "pending",
      location: payload.location || null,
      zone: payload.zone?.trim() || null,
    },
    details: {
      organizationName: payload.organizationName.trim(),
      legalDocument: payload.legalDocument.trim(),
      workArea: payload.workArea?.map((a) => a.trim()) || null,
      acceptedTerms: true,
      countryFiscal: payload.countryFiscal.trim(),
      fiscalIdType: payload.fiscalIdType.trim(),
      fiscalNumber: payload.fiscalNumber.trim(),
      entityType: payload.entityType.trim(),
      otherEntityType: payload.otherEntityType?.trim() || null,
      registrationNumber: Number(payload.registrationNumber),
      constitutionDate: payload.constitutionDate,
      legalAddress: payload.legalAddress.trim(),
      legalCountry: payload.legalCountry.trim(),
      province: payload.province.trim(),
      city: payload.city.trim(),
      legalRepresentativeName: payload.legalRepresentativeName.trim(),
      legalRepresentativePosition: payload.legalRepresentativePosition.trim(),
      legalRepresentativePhone: payload.legalRepresentativePhone.trim(),
      legalRepresentativeEmail: payload.legalRepresentativeEmail.trim().toLowerCase(),
      website: payload.website?.trim() || null,
      socialMedia: payload.socialMedia?.trim() || null,
      mission: payload.mission.trim(),
      vision: payload.vision.trim(),
      scope: payload.scope.trim(),
      collectiveServed: payload.collectiveServed.trim(),
      disabilityTypes: payload.disabilityTypes.map((t) => t.trim()),
      services: payload.services.trim(),
    },
  };
}

/**
 * Normaliza el payload de registro de administrador para inserción en DB.
 * No se crea fila en user_details (igual que citizen).
 * @param {Object} payload — ya validado por Zod
 * @returns {{ user: Object }}
 */
function normalizeRegisterAdmin(payload) {
  return {
    user: {
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim().replace(/[\s-]/g, ""),
      password: payload.password,
      role: "admin",
      status: "approved",
      location: payload.location || null,
      zone: payload.zone?.trim() || null,
    },
  };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  // Constantes
  ROLES,
  VALID_DAYS,
  VALID_DAYS_SET,
  INITIAL_STATUS,

  // Schemas Zod para validación 
  RegisterCitizenBody,
  RegisterVolunteerBody,
  RegisterOrganizationBody,
  RegisterAdminBody,
  LoginBody,

  // Schemas de respuesta para OpenAPI 
  UserProfile,
  LoginResponse,
  ErrorResponse,
  LocationSchema,

  // Normalizadores
  normalizeRegisterCitizen,
  normalizeRegisterVolunteer,
  normalizeRegisterOrganization,
  normalizeRegisterAdmin,
};
