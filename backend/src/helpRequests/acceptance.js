const { isBlank } = require("./shared");

function normalizeHelpRequestAcceptance(payload) {
  return {
    volunteerName: payload.volunteerName.trim(),
    volunteerContactMethod: payload.volunteerContactMethod.trim(),
    volunteerContactValue: payload.volunteerContactValue.trim(),
  };
}

function validateHelpRequestAcceptance(payload) {
  const errors = [];

  if (isBlank(payload.volunteerName)) {
    errors.push("volunteerName is required");
  }

  if (isBlank(payload.volunteerContactMethod)) {
    errors.push("volunteerContactMethod is required");
  }

  if (isBlank(payload.volunteerContactValue)) {
    errors.push("volunteerContactValue is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  normalizeHelpRequestAcceptance,
  validateHelpRequestAcceptance,
};
