import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DB,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  options: {
    trustServerCertificate: true,
  },
};

const connectDb = async () => {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to Server");
    return pool
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

export { sql, connectDb, config };
