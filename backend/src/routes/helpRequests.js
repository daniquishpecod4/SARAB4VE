const express = require("express");
const db = require("../db");
const {
  buildListHelpRequestsQuery,
  isUuid,
  normalizeHelpRequest,
  normalizeHelpRequestAcceptance,
  validateHelpRequest,
  validateHelpRequestAcceptance,
  validateHelpRequestSearchParams,
} = require("../validation/helpRequests");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const search = validateHelpRequestSearchParams(req.query);

  if (!search.isValid) {
    return res.status(400).json({ errors: search.errors });
  }

  try {
    const { sql, values } = buildListHelpRequestsQuery(search.filters);
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
                  description, latitude, longitude, urgency, status, assigned_at,
                  resolved_at, created_at
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
                  volunteer_name, volunteer_contact_method, volunteer_contact_value,
                  assigned_at, resolved_at
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

router.post("/:id/resolve", async (req, res, next) => {
  if (!isUuid(req.params.id)) {
    return res.status(400).json({ errors: ["id must be a valid UUID"] });
  }

  try {
    const updateResult = await db.query(
      `
        UPDATE help_requests
        SET status = 'resolved',
            resolved_at = NOW()
        WHERE id = $1 AND status = 'assigned'
        RETURNING id, requester_name, contact_method, contact_value, need_type,
                  description, latitude, longitude, urgency, status, created_at,
                  volunteer_name, volunteer_contact_method, volunteer_contact_value,
                  assigned_at, resolved_at
      `,
      [req.params.id],
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

    return res.status(409).json({ errors: ["help request is not assigned"] });
  } catch (error) {
    return next(error);
  }
});

module.exports = {
  router,
};
