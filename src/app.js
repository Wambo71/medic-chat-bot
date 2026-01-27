import express from "express";
import webhookRoutes from "./routes/webhook.js";

const app = express();
app.use(express.json());

app.use("/webhook", webhookRoutes);

export default app;
