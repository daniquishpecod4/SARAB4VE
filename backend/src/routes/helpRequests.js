const express = require("express");
const db = require("../db");
const {
  REQUEST_STATUS_SET,
  normalizeHelpRequest,
  validateHelpRequest,
} = require("../validation/helpRequests");

const router = express.Router();

router.get("/", async (req, res, next) => {
  if (req.query.status && !REQUEST_STATUS_SET.has(req.query.status)) {
    return res.status(400).json({ errors: ["status is invalid"] });
  }

  try {
    const values = [];
    let sql = `
      SELECT id, requester_name, contact_method, contact_value, need_type, description,
             latitude, longitude, urgency, status, created_at
      FROM help_requests
    `;

    if (req.query.status) {
      values.push(req.query.status);
      sql += ` WHERE status = $${values.length}`;
    }

    sql += " ORDER BY created_at DESC LIMIT 100";

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
