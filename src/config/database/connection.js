import fs from "fs";
import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();

const sslConfig = process.env.SSL_CERT_PATH
  ? {
      rejectUnauthorized: true,
      ca: fs.readFileSync(process.env.SSL_CERT_PATH).toString(),
    }
  : false;

const connection = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: sslConfig,
});

connection
  .connect()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });

export default connection;
