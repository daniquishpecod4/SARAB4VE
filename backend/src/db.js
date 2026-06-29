const { Pool } = require("pg");
const { databaseUrl } = require("./config");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: databaseUrl,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  close: () => pool.end(),
};
