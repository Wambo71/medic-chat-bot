import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  dob: Date,
  gender: String,
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
