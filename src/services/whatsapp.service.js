import axios from "axios";

const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_URL = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

export async function sendWhatsAppMessage(to, message) {
  try {
    const data = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body: message,
      },
    };

    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Message sent:", response.data);
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
}