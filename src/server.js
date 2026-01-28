import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config(); // Load .env variables at the very top

// 1️⃣ Get environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// 2️⃣ Make sure MONGO_URI exists
if (!MONGO_URI) {
  throw new Error("Missing required environment variable: MONGO_URI");
}

// 3️⃣ Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`✅ MongoDB connected`);
    
    // 4️⃣ Start Express server after DB connection
    app.listen(PORT, () => {
      console.log(`🏥 Clinic bot running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
