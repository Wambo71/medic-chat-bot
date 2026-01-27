import mongoose from "mongoose";

const labResultSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    testName: String,
    status: {
      type: String,
      enum: ["pending", "ready"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const LabResult = mongoose.model("LabResult", labResultSchema);
