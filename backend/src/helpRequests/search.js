const {
  DEFAULT_RADIUS_KM,
  MAX_RADIUS_KM,
  REQUEST_STATUS_SET,
  toNumber,
} = require("./shared");

function validateHelpRequestSearchParams(query) {
  const errors = [];
  const hasLatitude = query.latitude !== undefined;
  const hasLongitude = query.longitude !== undefined;
  const hasRadius = query.radiusKm !== undefined;
  const hasGeoFilter = hasLatitude || hasLongitude || hasRadius;

  if (query.status && !REQUEST_STATUS_SET.has(query.status)) {
    errors.push("status is invalid");
  }

  if (!hasGeoFilter) {
    return {
      isValid: errors.length === 0,
      errors,
      filters: {
        hasGeoFilter: false,
        latitude: null,
        longitude: null,
        radiusKm: null,
        status: query.status || null,
      },
    };
  }

  if (!hasLatitude || !hasLongitude) {
    errors.push("latitude and longitude are required together");
  }

  const latitude = hasLatitude ? toNumber(query.latitude) : null;
  const longitude = hasLongitude ? toNumber(query.longitude) : null;
  const radiusKm = hasRadius ? toNumber(query.radiusKm) : DEFAULT_RADIUS_KM;

  if (hasLatitude && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) {
    errors.push("latitude must be a valid coordinate");
  }

  if (hasLongitude && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) {
    errors.push("longitude must be a valid coordinate");
  }

  if (!Number.isFinite(radiusKm) || radiusKm <= 0 || radiusKm > MAX_RADIUS_KM) {
    errors.push(`radiusKm must be between 0 and ${MAX_RADIUS_KM}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    filters: {
      hasGeoFilter: true,
      latitude,
      longitude,
      radiusKm,
      status: query.status || null,
    },
  };
}

module.exports = {
  validateHelpRequestSearchParams,
};
