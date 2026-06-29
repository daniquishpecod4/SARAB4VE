const express = require("express");
const db = require("../db");
const {
  normalizeHelpRequest,
  validateHelpRequest,
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

module.exports = router;
