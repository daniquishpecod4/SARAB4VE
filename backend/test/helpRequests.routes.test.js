const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/test";

const app = require("../src/app");
const db = require("../src/db");

function request(server, method, path, body) {
  const address = server.address();
  const payload = body ? JSON.stringify(body) : null;

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: address.port,
        method,
        path,
        headers: payload
          ? {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(payload),
            }
          : {},
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            body: data ? JSON.parse(data) : null,
          });
        });
      },
    );

    req.on("error", reject);

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
}

test("rejects invalid accept route uuid before touching the database", async () => {
  let called = false;
  const originalQuery = db.query;
  db.query = async () => {
    called = true;
    throw new Error("db should not be called");
  };

  const server = app.listen(0);

  try {
    const response = await request(server, "POST", "/api/help-requests/not-a-uuid/accept", {
      volunteerName: "Luis Perez",
      volunteerContactMethod: "phone",
      volunteerContactValue: "+584121112233",
    });

    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.body, {
      errors: ["id must be a valid UUID"],
    });
    assert.equal(called, false);
  } finally {
    db.query = originalQuery;
    await new Promise((resolve) => server.close(resolve));
  }
});

test("returns conflict when an open help request was already taken", async () => {
  const originalQuery = db.query;
  const queryResults = [
    { rows: [] },
    { rows: [{ status: "assigned" }] },
  ];
  db.query = async () => queryResults.shift();

  const server = app.listen(0);

  try {
    const response = await request(
      server,
      "POST",
      "/api/help-requests/550e8400-e29b-41d4-a716-446655440000/accept",
      {
        volunteerName: "Luis Perez",
        volunteerContactMethod: "phone",
        volunteerContactValue: "+584121112233",
      },
    );

    assert.equal(response.statusCode, 409);
    assert.deepEqual(response.body, {
      errors: ["help request is not open"],
    });
  } finally {
    db.query = originalQuery;
    await new Promise((resolve) => server.close(resolve));
  }
});
