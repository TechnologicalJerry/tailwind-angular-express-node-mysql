import dotenv from "dotenv";
import config from "config";

// Load environment variables
dotenv.config();

console.log("=== Minimal Server Test ===");

try {
  console.log("1. Loading environment variables...");
  
  console.log("2. Testing configuration access...");
  const port = config.get<number>("port");
  console.log(`   Port: ${port}`);
  
  const dbConfig = config.get<any>("database");
  console.log(`   Database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
  
  console.log("3. Testing JWT configuration...");
  const accessKey = config.get<string>("accessTokenPrivateKey");
  console.log(`   Access token key: ${accessKey ? 'Present (' + accessKey.length + ' chars)' : 'Missing'}`);
  
  console.log("4. Testing module imports...");
  console.log("   ✅ dotenv imported successfully");
  console.log("   ✅ config imported successfully");
  
  console.log("5. Testing Express app creation...");
  const express = require("express");
  const app = express();
  console.log("   ✅ Express app created successfully");
  
  console.log("\n✅ All basic components are working");
  console.log("The issue might be in the database connection or routes");

} catch (error: any) {
  console.error("\n❌ Error during testing:", error.message);
  console.error("Stack trace:", error.stack);
}