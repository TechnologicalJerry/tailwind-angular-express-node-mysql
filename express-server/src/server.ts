import dotenv from "dotenv";
import config from "config";
import createApp from "./app";
import connect from "./utils/connect";
import logger from "./utils/logger";
import { startMetricsServer } from "./utils/metrics";
import swaggerDocs from "./utils/swagger";

// Load environment variables
dotenv.config();

async function startServer() {
  try {
    console.log("Starting server initialization...");
    
    // Get port from configuration
    console.log("1. Loading configuration...");
    const port = config.get<number>("port");
    console.log(`   Port: ${port}`);

    // Create Express app
    console.log("2. Creating Express app...");
    const app = createApp();
    console.log("   ✅ Express app created successfully");

    // Connect to database
    console.log("3. Connecting to database...");
    await connect();
    logger.info("Database connected successfully");

    // Start the server
    console.log("4. Starting HTTP server...");
    const server = app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });

    // Start metrics server
    console.log("5. Starting metrics server...");
    startMetricsServer();
    logger.info("Metrics server started");

    // Setup Swagger documentation
    console.log("6. Setting up Swagger documentation...");
    swaggerDocs(app, port);
    logger.info("Swagger documentation setup complete");

    console.log("✅ Server started successfully!");

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully`);
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  } catch (error: any) {
    console.error("❌ Failed to start server:");
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server only if this file is run directly
if (require.main === module) {
  startServer();
}

export { startServer };
export default createApp;
