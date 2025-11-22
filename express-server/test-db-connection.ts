import mysql from "mysql2/promise";
import config from "config";

async function testConnection() {
  const dbConfig = config.get<{
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  }>("database");

  try {
    console.log("Attempting to connect to MySQL with config:", {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });

    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      timezone: "+00:00",
    });

    console.log("✅ Successfully connected to MySQL database!");

    // Test a simple query
    const [rows] = await connection.execute("SELECT 1 as test");
    console.log("✅ Test query successful:", rows);

    await connection.end();
    console.log("✅ Connection closed successfully");

  } catch (error: any) {
    console.error("❌ Failed to connect to MySQL database:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

testConnection();