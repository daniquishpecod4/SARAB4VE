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

const NEED_TYPE_SET = new Set(NEED_TYPES);
const URGENCY_LEVEL_SET = new Set(URGENCY_LEVELS);
const REQUEST_STATUS_SET = new Set(REQUEST_STATUSES);

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
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

module.exports = {
  NEED_TYPES,
  URGENCY_LEVELS,
  REQUEST_STATUSES,
  NEED_TYPE_SET,
  URGENCY_LEVEL_SET,
  REQUEST_STATUS_SET,
  normalizeHelpRequest,
  validateHelpRequest,
};
