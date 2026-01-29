import mongoose from "mongoose";

const medicationReminderSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  medication: String,
  time: String,
});

export default mongoose.model("MedicationReminder", medicationReminderSchema);
