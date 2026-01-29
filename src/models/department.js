import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

export default mongoose.model("Department", departmentSchema);
