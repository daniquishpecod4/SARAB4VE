const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeHelpRequest,
  validateHelpRequest,
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
