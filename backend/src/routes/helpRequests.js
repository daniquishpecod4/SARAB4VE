const express = require("express");
const db = require("../db");
const {
  isUuid,
  normalizeHelpRequest,
  normalizeHelpRequestAcceptance,
  validateHelpRequest,
  validateHelpRequestAcceptance,
  validateHelpRequestSearchParams,
} = require("../validation/helpRequests");

const router = express.Router();

function buildDistanceExpression(latitudeIndex, longitudeIndex) {
  return `
    6371 * acos(
      least(
        1,
        greatest(
          -1,
          cos(radians($${latitudeIndex})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($${longitudeIndex})) +
          sin(radians($${latitudeIndex})) * sin(radians(latitude))
        )
      )
    )
  `;
}

router.get("/", async (req, res, next) => {
  const search = validateHelpRequestSearchParams(req.query);

  if (!search.isValid) {
    return res.status(400).json({ errors: search.errors });
  }

  try {
    const values = [];
    const conditions = [];
    let distanceExpression = null;
    const selectFields = [
      "id",
      "requester_name",
      "contact_method",
      "contact_value",
      "need_type",
      "description",
      "latitude",
      "longitude",
      "urgency",
      "status",
      "created_at",
    ];
    let orderBy = "created_at DESC";

    if (search.filters.status) {
      values.push(search.filters.status);
      conditions.push(`status = $${values.length}`);
    }

    if (search.filters.hasGeoFilter) {
      values.push(search.filters.latitude);
      const latitudeIndex = values.length;
      values.push(search.filters.longitude);
      const longitudeIndex = values.length;
      values.push(search.filters.radiusKm);
      const radiusIndex = values.length;

      distanceExpression = buildDistanceExpression(latitudeIndex, longitudeIndex);
      selectFields.push(`ROUND((${distanceExpression})::numeric, 3) AS "distanceKm"`);
      conditions.push(`(${distanceExpression}) <= $${radiusIndex}`);
      orderBy = `"distanceKm" ASC, created_at DESC`;
    }

    let sql = `SELECT ${selectFields.join(", ")} FROM help_requests`;

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` ORDER BY ${orderBy} LIMIT 100`;

    const result = await db.query(sql, values);
    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const validation = validateHelpRequest(req.body);

  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }

  const payload = normalizeHelpRequest(req.body);

  try {
    const result = await db.query(
      `
        INSERT INTO help_requests (
          requester_name,
          contact_method,
          contact_value,
          need_type,
          description,
          latitude,
          longitude,
          urgency
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, requester_name, contact_method, contact_value, need_type,
                  description, latitude, longitude, urgency, status, created_at
      `,
      [
        payload.requesterName,
        payload.contactMethod,
        payload.contactValue,
        payload.needType,
        payload.description,
        payload.latitude,
        payload.longitude,
        payload.urgency,
      ],
    );

    return res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/accept", async (req, res, next) => {
  if (!isUuid(req.params.id)) {
    return res.status(400).json({ errors: ["id must be a valid UUID"] });
  }

  const validation = validateHelpRequestAcceptance(req.body);

  if (!validation.isValid) {
    return res.status(400).json({ errors: validation.errors });
  }

  const payload = normalizeHelpRequestAcceptance(req.body);

  try {
    const updateResult = await db.query(
      `
        UPDATE help_requests
        SET volunteer_name = $2,
            volunteer_contact_method = $3,
            volunteer_contact_value = $4,
            status = 'assigned',
            assigned_at = NOW()
        WHERE id = $1 AND status = 'open'
        RETURNING id, requester_name, contact_method, contact_value, need_type,
                  description, latitude, longitude, urgency, status, created_at,
                  volunteer_name, volunteer_contact_method, volunteer_contact_value, assigned_at
      `,
      [
        req.params.id,
        payload.volunteerName,
        payload.volunteerContactMethod,
        payload.volunteerContactValue,
      ],
    );

    if (updateResult.rows.length > 0) {
      return res.json({ data: updateResult.rows[0] });
    }

    const existingResult = await db.query(
      "SELECT status FROM help_requests WHERE id = $1",
      [req.params.id],
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ errors: ["help request not found"] });
    }

    return res.status(409).json({ errors: ["help request is not open"] });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
