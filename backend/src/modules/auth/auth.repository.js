/**
 * Repositorio — consultas SQL para el dominio de auth (registro de usuarios).
 * Todas las funciones de escritura reciben un cliente de transacción (PoolClient)
 * para que el servicio pueda coordinarlas atómicamente.
 */
const db = require("../../db");

// ---------------------------------------------------------------------------
// Constantes — columnas explícitas (nunca SELECT *)
// ---------------------------------------------------------------------------

/** Columnas que se retornan al crear un usuario (sin passwordHash). */
const USER_SELECT_COLUMNS = `
  id,
  full_name AS "fullName",
  email,
  phone,
  role,
  status,
  ST_AsGeoJSON(location)::json AS location,
  zone,
  phone_verified AS "phoneVerified",
  email_verified AS "emailVerified",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;



/** Columnas de user_details. */
const USER_DETAILS_SELECT_COLUMNS = `
  skills,
  available_hours AS "availableHours",
  available_days AS "availableDays",
  organization_name AS "organizationName",
  legal_document AS "legalDocument",
  work_area AS "workArea",
  accepted_terms AS "acceptedTerms",
  terms_accepted_at AS "termsAcceptedAt",
  approved_by AS "approvedBy",
  approved_at AS "approvedAt",
  updated_at AS "updatedAt",

  -- Campos de Organizaciones
  country_fiscal AS "countryFiscal",
  fiscal_id_type AS "fiscalIdType",
  fiscal_number AS "fiscalNumber",
  entity_type AS "entityType",
  other_entity_type AS "otherEntityType",
  registration_number AS "registrationNumber",
  constitution_date AS "constitutionDate",
  legal_address AS "legalAddress",
  legal_country AS "legalCountry",
  province AS "province",
  city AS "city",
  legal_representative_name AS "legalRepresentativeName",
  legal_representative_position AS "legalRepresentativePosition",
  legal_representative_phone AS "legalRepresentativePhone",
  legal_representative_email AS "legalRepresentativeEmail",
  website AS "website",
  social_media AS "socialMedia",
  mission AS "mission",
  vision AS "vision",
  scope AS "scope",
  collective_served AS "collectiveServed",
  disability_types AS "disabilityTypes",
  services AS "services",

  -- Campos de Voluntarios
  document_number AS "documentNumber",
  birth_date AS "birthDate",
  address AS "address",
  volunteer_type AS "volunteerType",
  profession AS "profession",
  languages AS "languages",
  experience_categories AS "experienceCategories",
  schedule_hours AS "scheduleHours",
  modality_presential AS "modalityPresential",
  modality_online AS "modalityOnline",
  interest_areas AS "interestAreas",
  has_prior_experience AS "hasPriorExperience"
`;

// ---------------------------------------------------------------------------
// INSERT — users
// ---------------------------------------------------------------------------

const INSERT_USER = `
  INSERT INTO users (
    full_name,
    email,
    phone,
    password_hash,
    role,
    status,
    location,
    zone
  )
  VALUES (
    $1, $2, $3, $4, $5, $6,
    CASE
      WHEN $7::jsonb IS NOT NULL
      THEN ST_SetSRID(ST_MakePoint(($7->>'lng')::float, ($7->>'lat')::float), 4326)::geography
      ELSE NULL
    END,
    $8
  )
  RETURNING ${USER_SELECT_COLUMNS}
`;

/**
 * Inserta un registro en la tabla users.
 * @param {import("pg").PoolClient} client — Cliente de transacción
 * @param {Object} user — Payload normalizado del usuario
 * @param {string} user.fullName
 * @param {string} user.email
 * @param {string} user.phone
 * @param {string} user.passwordHash — Ya hasheado por el servicio
 * @param {string} user.role
 * @param {string} user.status
 * @param {Object|null} user.location — { lat, lng } o null
 * @param {string|null} user.zone
 * @returns {Promise<Object>} — Fila insertada sin password_hash
 */
async function insertUser(client, user) {
  const locationJson = user.location ? JSON.stringify(user.location) : null;

  const result = await client.query(INSERT_USER, [
    user.fullName,
    user.email,
    user.phone,
    user.passwordHash,
    user.role,
    user.status,
    locationJson,
    user.zone,
  ]);

  return result.rows[0];
}

// ---------------------------------------------------------------------------
// INSERT — user_details
// ---------------------------------------------------------------------------

const INSERT_USER_DETAILS = `
  INSERT INTO user_details (
    user_id,
    skills,
    available_hours,
    available_days,
    organization_name,
    legal_document,
    work_area,
    accepted_terms,
    terms_accepted_at,

    -- Campos de Organizaciones
    country_fiscal,
    fiscal_id_type,
    fiscal_number,
    entity_type,
    other_entity_type,
    registration_number,
    constitution_date,
    legal_address,
    legal_country,
    province,
    city,
    legal_representative_name,
    legal_representative_position,
    legal_representative_phone,
    legal_representative_email,
    website,
    social_media,
    mission,
    vision,
    scope,
    collective_served,
    disability_types,
    services,

    -- Campos de Voluntarios
    document_number,
    birth_date,
    address,
    volunteer_type,
    profession,
    languages,
    experience_categories,
    schedule_hours,
    modality_presential,
    modality_online,
    interest_areas,
    has_prior_experience
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, NOW(),
    $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
    $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42
  )
  RETURNING ${USER_DETAILS_SELECT_COLUMNS}
`;

/**
 * Inserta un registro en la tabla user_details.
 * @param {import("pg").PoolClient} client — Cliente de transacción
 * @param {string} userId — UUID del usuario recién creado
 * @param {Object} details — Payload normalizado de detalles
 * @returns {Promise<Object>} — Fila insertada
 */
async function insertUserDetails(client, userId, details) {
  const result = await client.query(INSERT_USER_DETAILS, [
    userId,
    details.skills || null,
    details.availableHours || null,
    details.availableDays || null,
    details.organizationName || null,
    details.legalDocument || null,
    details.workArea || null,
    details.acceptedTerms,

    // Campos de Organizaciones
    details.countryFiscal || null,
    details.fiscalIdType || null,
    details.fiscalNumber || null,
    details.entityType || null,
    details.otherEntityType || null,
    details.registrationNumber || null,
    details.constitutionDate || null,
    details.legalAddress || null,
    details.legalCountry || null,
    details.province || null,
    details.city || null,
    details.legalRepresentativeName || null,
    details.legalRepresentativePosition || null,
    details.legalRepresentativePhone || null,
    details.legalRepresentativeEmail || null,
    details.website || null,
    details.socialMedia || null,
    details.mission || null,
    details.vision || null,
    details.scope || null,
    details.collectiveServed || null,
    details.disabilityTypes || null,
    details.services || null,

    // Campos de Voluntarios
    details.documentNumber || null,
    details.birthDate || null,
    details.address || null,
    details.volunteerType || null,
    details.profession || null,
    details.languages || null,
    details.experienceCategories || null,
    details.scheduleHours || null,
    details.modalityPresential || false,
    details.modalityOnline || false,
    details.interestAreas || null,
    details.hasPriorExperience !== undefined ? details.hasPriorExperience : null
  ]);

  return result.rows[0];
}

// ---------------------------------------------------------------------------
// Helpers de transacción
// ---------------------------------------------------------------------------

/**
 * Abre una transacción y ejecuta el callback.
 * Hace commit si el callback resuelve, rollback si lanza error.
 * Siempre libera el cliente al final.
 *
 * @template T
 * @param {(client: import("pg").PoolClient) => Promise<T>} callback
 * @returns {Promise<T>}
 */
async function withTransaction(callback) {
  const client = await db.getClient();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// SELECT — búsqueda por email (para login, incluye password_hash)
// ---------------------------------------------------------------------------

const FIND_USER_BY_EMAIL = `
  SELECT
    id,
    full_name AS "fullName",
    email,
    phone,
    password_hash AS "passwordHash",
    role,
    status,
    ST_AsGeoJSON(location)::json AS location,
    zone,
    phone_verified AS "phoneVerified",
    email_verified AS "emailVerified",
    created_at AS "createdAt",
    updated_at AS "updatedAt"
  FROM users
  WHERE email = $1
`;

/**
 * Busca un usuario por email. Retorna todas las columnas incluyendo password_hash
 * para que el servicio pueda comparar contraseñas.
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
async function findUserByEmail(email) {
  const result = await db.query(FIND_USER_BY_EMAIL, [email.toLowerCase().trim()]);
  return result.rows[0] || null;
}

// ---------------------------------------------------------------------------
// SELECT — búsqueda por ID (para /me, sin password_hash)
// ---------------------------------------------------------------------------

const FIND_USER_BY_ID = `
  SELECT ${USER_SELECT_COLUMNS}
  FROM users
  WHERE id = $1
`;

/**
 * Busca un usuario por ID. No retorna password_hash.
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function findUserById(userId) {
  const result = await db.query(FIND_USER_BY_ID, [userId]);
  return result.rows[0] || null;
}

module.exports = {
  USER_SELECT_COLUMNS,
  USER_DETAILS_SELECT_COLUMNS,
  insertUser,
  insertUserDetails,
  withTransaction,
  findUserByEmail,
  findUserById,
};
