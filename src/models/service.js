import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
});

export default mongoose.model("Service", serviceSchema);
