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

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
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
  isBlank,
  isFiniteNumber,
  isUuid,
  toNumber,
};
