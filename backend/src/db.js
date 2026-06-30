const { Pool } = require("pg");
const { databaseUrl } = require("./config");

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
    })
  : null;

module.exports = {
  query: (text, params) => {
    if (!pool) {
      throw new Error("DATABASE_URL is required");
    }

    return pool.query(text, params);
  },
  close: () => pool.end(),
};
