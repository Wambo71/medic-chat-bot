import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import app from "./app.js";
import logger from "./utils/logger.js";

dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'VERIFY_TOKEN'];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

await connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🏥 Clinic bot running on port ${PORT}`);
});
