/**
 * Repositorio — consultas SQL para el dominio de administración de usuarios.
 * Todas las funciones de escritura reciben un cliente de transacción (PoolClient)
 * para que el servicio pueda coordinarlas atómicamente.
 */
const db = require("../../db");

// ---------------------------------------------------------------------------
// Constantes — columnas explícitas (nunca SELECT *)
// ---------------------------------------------------------------------------

/** Columnas que se retornan al consultar un usuario (sin passwordHash). */
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
  user_id AS "userId",
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
// SELECT — listar usuarios con filtros y paginación
// ---------------------------------------------------------------------------

/**
 * Construye dinámicamente la consulta de listado con filtros opcionales.
 * @param {Object} filters
 * @param {string} [filters.role]
 * @param {string} [filters.status]
 * @param {string} [filters.search]
 * @param {number} [filters.limit]
 * @param {number} [filters.offset]
 * @returns {{ text: string, params: Array }}
 */
function buildListUsersQuery(filters = {}) {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (filters.role) {
    conditions.push(`u.role = $${paramIndex++}`);
    params.push(filters.role);
  }

  if (filters.status) {
    conditions.push(`u.status = $${paramIndex++}`);
    params.push(filters.status);
  }

  if (filters.search) {
    conditions.push(
      `(u.full_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`,
    );
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;

  // Consulta de datos
  const dataQuery = `
    SELECT ${USER_SELECT_COLUMNS}
    FROM users u
    ${whereClause}
    ORDER BY u.created_at DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;

  const dataParams = [...params, limit, offset];

  // Consulta de conteo
  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM users u
    ${whereClause}
  `;

  return { dataQuery, countQuery, dataParams, countParams: params };
}

/**
 * Lista usuarios con filtros opcionales y paginación.
 * @param {Object} filters
 * @returns {Promise<{ users: Object[], total: number, limit: number, offset: number }>}
 */
async function listUsers(filters = {}) {
  const { dataQuery, countQuery, dataParams, countParams } =
    buildListUsersQuery(filters);

  const [dataResult, countResult] = await Promise.all([
    db.query(dataQuery, dataParams),
    db.query(countQuery, countParams),
  ]);

  return {
    users: dataResult.rows,
    total: countResult.rows[0]?.total || 0,
    limit: filters.limit || 50,
    offset: filters.offset || 0,
  };
}

// ---------------------------------------------------------------------------
// SELECT — buscar usuario por ID
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

// ---------------------------------------------------------------------------
// SELECT — buscar detalles de usuario
// ---------------------------------------------------------------------------

const FIND_USER_DETAILS_BY_ID = `
  SELECT ${USER_DETAILS_SELECT_COLUMNS}
  FROM user_details
  WHERE user_id = $1
`;

/**
 * Busca los detalles de un usuario (skills, org info, etc.).
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function findUserDetailsById(userId) {
  const result = await db.query(FIND_USER_DETAILS_BY_ID, [userId]);
  return result.rows[0] || null;
}

// ---------------------------------------------------------------------------
// UPDATE — actualizar datos básicos del usuario
// ---------------------------------------------------------------------------

/**
 * Construye dinámicamente el UPDATE de users con solo los campos enviados.
 * @param {import("pg").PoolClient} client — Cliente de transacción
 * @param {string} userId
 * @param {Object} updates — Campos a actualizar (fullName, email, phone, zone, location, passwordHash)
 * @returns {Promise<Object>} — Fila actualizada sin password_hash
 */
async function updateUser(client, userId, updates) {
  const setClauses = [];
  const params = [];
  let paramIndex = 1;

  // Siempre actualizar updated_at
  setClauses.push(`updated_at = NOW()`);

  if (updates.fullName !== undefined) {
    setClauses.push(`full_name = $${paramIndex++}`);
    params.push(updates.fullName);
  }

  if (updates.email !== undefined) {
    setClauses.push(`email = $${paramIndex++}`);
    params.push(updates.email);
  }

  if (updates.phone !== undefined) {
    setClauses.push(`phone = $${paramIndex++}`);
    params.push(updates.phone);
  }

  if (updates.zone !== undefined) {
    setClauses.push(`zone = $${paramIndex++}`);
    params.push(updates.zone);
  }

  if (updates.location !== undefined) {
    setClauses.push(
      `location = CASE WHEN $${paramIndex}::jsonb IS NOT NULL THEN ST_SetSRID(ST_MakePoint(($${paramIndex}->>'lng')::float, ($${paramIndex}->>'lat')::float), 4326)::geography ELSE NULL END`,
    );
    params.push(updates.location ? JSON.stringify(updates.location) : null);
    paramIndex++;
  }

  if (updates.passwordHash !== undefined) {
    setClauses.push(`password_hash = $${paramIndex++}`);
    params.push(updates.passwordHash);
  }

  // Si no hay nada que actualizar (solo updated_at), no hacemos nada
  if (setClauses.length === 1 && updates.passwordHash === undefined) {
    // Solo updated_at — devolver el usuario sin cambios
    return findUserById(userId);
  }

  params.push(userId);

  const query = `
    UPDATE users
    SET ${setClauses.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING ${USER_SELECT_COLUMNS}
  `;

  const result = await (client || db).query(query, params);
  return result.rows[0] || null;
}

// ---------------------------------------------------------------------------
// UPDATE — cambiar estado del usuario (aprobar/rechazar)
// ---------------------------------------------------------------------------

/**
 * Actualiza el estado de un usuario. Si es 'approved', también actualiza
 * user_details con approved_by y approved_at.
 *
 * @param {import("pg").PoolClient} client — Cliente de transacción
 * @param {string} userId
 * @param {"approved"|"rejected"|"suspended"} newStatus
 * @param {string} approvedBy — UUID del admin que aprueba/rechaza
 * @returns {Promise<Object>} — Fila actualizada sin password_hash
 */
async function updateUserStatus(client, userId, newStatus, approvedBy) {
  const updateUserQuery = `
    UPDATE users
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING ${USER_SELECT_COLUMNS}
  `;

  const result = await client.query(updateUserQuery, [newStatus, userId]);

  // Si es approved, actualizar user_details
  if (newStatus === "approved") {
    const updateDetailsQuery = `
      UPDATE user_details
      SET approved_by = $1, approved_at = NOW(), updated_at = NOW()
      WHERE user_id = $2
    `;
    await client.query(updateDetailsQuery, [approvedBy, userId]);
  }

  return result.rows[0] || null;
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

module.exports = {
  USER_SELECT_COLUMNS,
  USER_DETAILS_SELECT_COLUMNS,
  buildListUsersQuery,
  listUsers,
  findUserById,
  findUserDetailsById,
  updateUser,
  updateUserStatus,
  withTransaction,
};
