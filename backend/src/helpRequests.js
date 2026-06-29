const NEED_TYPES = [
  "equipment",
  "medication",
  "transport",
  "companionship",
  "interpreter",
  "accessible_information",
  "neurodivergent_support",
  "psychosocial_support",
];

const URGENCY_LEVELS = ["low", "medium", "high", "critical"];
const REQUEST_STATUSES = ["open", "assigned", "resolved"];
const DEFAULT_RADIUS_KM = 10;
const MAX_RADIUS_KM = 100;

const NEED_TYPE_SET = new Set(NEED_TYPES);
const URGENCY_LEVEL_SET = new Set(URGENCY_LEVELS);
const REQUEST_STATUS_SET = new Set(REQUEST_STATUSES);

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function toNumber(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return Number.NaN;
  }

  return Number(value);
}

function normalizeHelpRequest(payload) {
  return {
    requesterName: payload.requesterName.trim(),
    contactMethod: payload.contactMethod.trim(),
    contactValue: payload.contactValue.trim(),
    needType: payload.needType,
    description: payload.description.trim(),
    latitude: payload.latitude,
    longitude: payload.longitude,
    urgency: payload.urgency || "medium",
  };
}

function validateHelpRequest(payload) {
  const errors = [];

  if (isBlank(payload.requesterName)) {
    errors.push("requesterName is required");
  }

  if (isBlank(payload.contactMethod)) {
    errors.push("contactMethod is required");
  }

  if (isBlank(payload.contactValue)) {
    errors.push("contactValue is required");
  }

  if (!NEED_TYPE_SET.has(payload.needType)) {
    errors.push("needType is invalid");
  }

  if (isBlank(payload.description)) {
    errors.push("description is required");
  }

  if (!isFiniteNumber(payload.latitude) || payload.latitude < -90 || payload.latitude > 90) {
    errors.push("latitude must be a valid coordinate");
  }

  if (!isFiniteNumber(payload.longitude) || payload.longitude < -180 || payload.longitude > 180) {
    errors.push("longitude must be a valid coordinate");
  }

  if (payload.urgency && !URGENCY_LEVEL_SET.has(payload.urgency)) {
    errors.push("urgency is invalid");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

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
  DEFAULT_RADIUS_KM,
  MAX_RADIUS_KM,
  NEED_TYPES,
  URGENCY_LEVELS,
  REQUEST_STATUSES,
  NEED_TYPE_SET,
  URGENCY_LEVEL_SET,
  REQUEST_STATUS_SET,
  normalizeHelpRequest,
  validateHelpRequest,
  validateHelpRequestSearchParams,
};
