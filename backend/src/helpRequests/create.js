const { NEED_TYPE_SET, URGENCY_LEVEL_SET, isBlank, isFiniteNumber } = require("./shared");

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
  normalizeHelpRequest,
  validateHelpRequest,
};
