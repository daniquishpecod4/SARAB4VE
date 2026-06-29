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

function buildListHelpRequestsQuery(filters) {
  const values = [];
  const baseConditions = [];

  if (filters.status) {
    values.push(filters.status);
    baseConditions.push(`status = $${values.length}`);
  }

  if (!filters.hasGeoFilter) {
    let sql = `
      SELECT id, requester_name, contact_method, contact_value, need_type, description,
             latitude, longitude, urgency, status, created_at
      FROM help_requests
    `;

    if (baseConditions.length > 0) {
      sql += ` WHERE ${baseConditions.join(" AND ")}`;
    }

    sql += " ORDER BY created_at DESC LIMIT 100";

    return { sql, values };
  }

  values.push(filters.latitude);
  const latitudeIndex = values.length;
  values.push(filters.longitude);
  const longitudeIndex = values.length;
  values.push(filters.radiusKm);
  const radiusIndex = values.length;

  const distanceExpression = buildDistanceExpression(latitudeIndex, longitudeIndex);
  const whereClause = baseConditions.length > 0 ? `WHERE ${baseConditions.join(" AND ")}` : "";

  const sql = `
    WITH scoped_help_requests AS (
      SELECT id, requester_name, contact_method, contact_value, need_type, description,
             latitude, longitude, urgency, status, created_at,
             ROUND((${distanceExpression})::numeric, 3) AS "distanceKm"
      FROM help_requests
      ${whereClause}
    )
    SELECT *
    FROM scoped_help_requests
    WHERE "distanceKm" <= $${radiusIndex}
    ORDER BY "distanceKm" ASC, created_at DESC
    LIMIT 100
  `;

  return { sql, values };
}

module.exports = {
  buildListHelpRequestsQuery,
};
