import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

async function connect() {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    logger.info("Connected to MongoDB database");
  } catch (error: any) {
    logger.error(`Could not connect to MongoDB database: ${error.message}`);
    process.exit(1);
  }
}

export default connect;
