import { sendWhatsAppMessage } from "../services/whatsapp.js";
import { getMainMenu } from "../utils/menu.js";
import { findOrCreatePatient } from "../services/patient.js";
import { getAvailableDoctors } from "../services/doctor.js";
import { getLabResults } from "../controllers/lab.controller.js";
import { bookAppointment } from "../services/appointment.js";
import { getConversationState, setConversationState, clearConversationState } from "../services/conversation.js";
import logger from "../utils/logger.js";

async function handleConversationStep(phone, text, state) {
  let reply;
  if (state.step === 'book_department') {
    state.data.department = text;
    setConversationState(phone, { step: 'book_date', data: state.data });
    reply = "Please enter the appointment date (YYYY-MM-DD):";
  } else if (state.step === 'book_date') {
    // Simple date validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      reply = "Invalid date format. Please enter YYYY-MM-DD:";
      return reply;
    }
    state.data.date = new Date(text);
    const patient = await findOrCreatePatient(phone);
    try {
      await bookAppointment(patient._id, state.data.department, state.data.date);
      clearConversationState(phone);
      reply = `Appointment booked for ${text} in ${state.data.department}.`;
    } catch (error) {
      clearConversationState(phone);
      reply = `Failed to book appointment: ${error.message}`;
    }
  } else {
    clearConversationState(phone);
    reply = "Unknown step. Returning to menu.\n" + getMainMenu();
  }
  return reply;
}

export async function receiveMessage(req, res) {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const phone = message.from;
    const text = message.text?.body?.toLowerCase();

    // Input validation
    if (!phone || !/^\d+$/.test(phone)) {
      logger.error("Invalid phone number");
      return res.sendStatus(400);
    }
    if (!text || text.length > 1000) {
      logger.error("Invalid text message");
      return res.sendStatus(400);
    }

    const state = getConversationState(phone);
    let reply;

    if (state.step !== 'menu') {
      // Handle conversation flow
      reply = await handleConversationStep(phone, text, state);
    } else {
      // Handle menu commands
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
        case "book":
          setConversationState(phone, { step: 'book_department', data: {} });
          reply = "Please enter the department (e.g., General, Pediatrics, Gynecology):";
          break;
        case "doctors":
          const doctors = await getAvailableDoctors();
          reply = doctors.length ? `Available Doctors:\n${doctors.join('\n')}` : "No doctors available.";
          break;
        case "results":
          const patient = await findOrCreatePatient(phone);
          const results = await getLabResults(patient._id);
          reply = results.length ? `Your Lab Results:\n${results.map(r => `${r.testName}: ${r.status}`).join('\n')}` : "No lab results found.";
          break;
        case "stop":
          clearConversationState(phone);
          reply = "You have been unsubscribed.";
          break;
        default:
          reply = getMainMenu();
      }
    }

    await sendWhatsAppMessage(phone, reply);
    res.sendStatus(200);
  } catch (error) {
    logger.error("Error handling message:", error);
    res.sendStatus(500);
  }
}
