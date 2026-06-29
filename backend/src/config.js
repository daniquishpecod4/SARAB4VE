const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 3001),
  databaseUrl: process.env.DATABASE_URL || "",
};
