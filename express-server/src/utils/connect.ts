import mysql from "mysql2/promise";
import config from "config";
import logger from "./logger";

async function connect() {
  const dbConfig = {
    host: config.get<string>("dbHost"),
    user: config.get<string>("dbUser"),
    password: config.get<string>("dbPassword"),
    database: config.get<string>("dbName"),
  };

  try {
    // Create a MySQL connection pool
    const pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test the connection
    const connection = await pool.getConnection();
    logger.info("Connected to MySQL database");
    connection.release();

    return pool; // Return the pool for use in the application
  } catch (error: any) {
    logger.error(`Could not connect to MySQL database: ${error.message}`);
    process.exit(1);
  }
}

export default connect;
