import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  amount: Number,
  status: { type: String, default: "Unpaid" },
});

export default mongoose.model("Billing", billingSchema);
