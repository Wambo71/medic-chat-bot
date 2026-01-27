import { sendWhatsAppMessage } from "../services/whatsapp.service.js";
import { getMainMenu } from "../utils/menu.js";

export async function receiveMessage(req, res) {
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return res.sendStatus(200);

  const phone = message.from;
  const text = message.text?.body?.toLowerCase();

  let reply;

  switch (text) {
    case "1":
      reply = "📅 Book Appointment\nSend: BOOK";
      break;
    case "2":
      reply = "👨‍⚕️ Doctor Availability\nSend: DOCTORS";
      break;
    case "3":
      reply = "🧪 Lab Results\nSend: RESULTS";
      break;
    case "stop":
      reply = "You have been unsubscribed.";
      break;
    default:
      reply = getMainMenu();
  }

  await sendWhatsAppMessage(phone, reply);
  res.sendStatus(200);
}
