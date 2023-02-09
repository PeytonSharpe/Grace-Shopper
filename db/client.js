const { Client } = require("pg");
//postgres://postgres:123456@127.0.0.1:5432/dummy
const connectionString =
  process.env.DATABASE_URL ||
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db:5432/${process.env.POSTGRES_DB}`;

const client = new Client({
  connectionString,
  // host: "db",
  // user: "user",
  // password: "mysecretpassword",
  // database: "graceShopper",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = { client };
