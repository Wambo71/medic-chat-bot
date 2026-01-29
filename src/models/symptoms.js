import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  description: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Symptom", symptomSchema);
