import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import apiRoutes from "./routes/api.routes.js";

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json()); // parse JSON requests

/* ======================
   ROUTES
====================== */
app.use("/api", apiRoutes);

/* ======================
   ROOT CHECK
====================== */
app.get("/", (req, res) => {
  res.send("🏥 Hospital Chat Bot Backend Running");
});

/* ======================
   DATABASE CONNECTION
====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

export default app;
