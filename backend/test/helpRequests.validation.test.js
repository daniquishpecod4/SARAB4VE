const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DEFAULT_RADIUS_KM,
  isUuid,
  normalizeHelpRequest,
  normalizeHelpRequestAcceptance,
  validateHelpRequest,
  validateHelpRequestAcceptance,
  validateHelpRequestSearchParams,
} = require("../src/validation/helpRequests");

test("accepts a valid help request payload", () => {
  const result = validateHelpRequest({
    requesterName: "Ana Perez",
    contactMethod: "phone",
    contactValue: "+584141234567",
    needType: "transport",
    description: "Necesito llegar a un refugio accesible",
    latitude: 10.4806,
    longitude: -66.9036,
    urgency: "high",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, []);
});

test("rejects invalid coordinates and need type", () => {
  const result = validateHelpRequest({
    requesterName: "Ana Perez",
    contactMethod: "phone",
    contactValue: "+584141234567",
    needType: "other",
    description: "Necesito ayuda",
    latitude: 200,
    longitude: -300,
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, [
    "needType is invalid",
    "latitude must be a valid coordinate",
    "longitude must be a valid coordinate",
  ]);
});

test("normalizes trimmed fields and default urgency", () => {
  const result = normalizeHelpRequest({
    requesterName: " Ana Perez ",
    contactMethod: " phone ",
    contactValue: " +584141234567 ",
    needType: "transport",
    description: " Necesito ayuda ",
    latitude: 10.4806,
    longitude: -66.9036,
  });

  assert.deepEqual(result, {
    requesterName: "Ana Perez",
    contactMethod: "phone",
    contactValue: "+584141234567",
    needType: "transport",
    description: "Necesito ayuda",
    latitude: 10.4806,
    longitude: -66.9036,
    urgency: "medium",
  });
});

test("accepts valid geolocation search params and applies default radius", () => {
  const result = validateHelpRequestSearchParams({
    latitude: "10.4806",
    longitude: "-66.9036",
    status: "open",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.filters, {
    hasGeoFilter: true,
    latitude: 10.4806,
    longitude: -66.9036,
    radiusKm: DEFAULT_RADIUS_KM,
    status: "open",
  });
});

test("rejects partial geolocation params", () => {
  const result = validateHelpRequestSearchParams({
    latitude: "10.4806",
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, ["latitude and longitude are required together"]);
});

test("rejects invalid radius and status in geolocation search", () => {
  const result = validateHelpRequestSearchParams({
    latitude: "10.4806",
    longitude: "-66.9036",
    radiusKm: "500",
    status: "pending",
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, [
    "status is invalid",
    "radiusKm must be between 0 and 100",
  ]);
});

test("acceptance payload requires volunteer fields", () => {
  const result = validateHelpRequestAcceptance({
    volunteerName: "Luis Perez",
    volunteerContactMethod: "",
    volunteerContactValue: "   ",
  });

  assert.equal(result.isValid, false);
  assert.deepEqual(result.errors, [
    "volunteerContactMethod is required",
    "volunteerContactValue is required",
  ]);
});

test("acceptance payload normalizes volunteer fields", () => {
  const result = normalizeHelpRequestAcceptance({
    volunteerName: " Luis Perez ",
    volunteerContactMethod: " phone ",
    volunteerContactValue: " +584121112233 ",
  });

  assert.deepEqual(result, {
    volunteerName: "Luis Perez",
    volunteerContactMethod: "phone",
    volunteerContactValue: "+584121112233",
  });
});

test("uuid validator accepts standard uuid and rejects junk", () => {
  assert.equal(isUuid("550e8400-e29b-41d4-a716-446655440000"), true);
  assert.equal(isUuid("not-a-uuid"), false);
});
