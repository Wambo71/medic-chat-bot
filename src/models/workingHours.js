import mongoose from "mongoose";

const workingHoursSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  day: String,
  open: String,
  close: String,
});

export default mongoose.model("WorkingHours", workingHoursSchema);
