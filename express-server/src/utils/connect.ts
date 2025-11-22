import mysql from "mysql2/promise";
import config from "config";
import logger from "./logger";

export let db: mysql.Connection;

async function connect() {
  const dbConfig = config.get<{
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  }>("database");

  try {
    db = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      timezone: "+00:00",
    });

    logger.info("Connected to MySQL database");
  } catch (error: any) {
    logger.error(`Could not connect to MySQL database: ${error.message}`);
    process.exit(1);
  }
}

export default connect;
