import cron from "node-cron";
import { sendWhatsAppMessage } from "./whatsapp.js";
import { Patient } from "../models/patient.js";
import logger from "../utils/logger.js";

cron.schedule("0 8 * * *", async () => {
  try {
    const patients = await Patient.find({});
    for (const patient of patients) {
      if (patient.phone) {
        await sendWhatsAppMessage(
          patient.phone,
          "💊 Reminder: Take your morning medication"
        );
      }
    }
  } catch (error) {
    logger.error("Error sending reminders:", error);
  }
});
