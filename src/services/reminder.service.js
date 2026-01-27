import cron from "node-cron";
import { sendWhatsAppMessage } from "./whatsapp.service.js";

cron.schedule("0 8 * * *", async () => {
  await sendWhatsAppMessage(
    "2547XXXXXXXX",
    "💊 Reminder: Take your morning medication"
  );
});
