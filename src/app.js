import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json()); // parse JSON body

// -------------------------------
// 1️⃣ MongoDB Models
// -------------------------------

const patientSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  dob: Date,
  gender: String,
});

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  phone: String,
  email: String,
  availability: [String], // e.g., ["Monday", "Tuesday"]
});

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  date: Date,
  status: { type: String, default: "Scheduled" }, // Scheduled, Completed, Cancelled
});

const labResultSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  testName: String,
  result: String,
  date: { type: Date, default: Date.now },
});

const Patient = mongoose.model("Patient", patientSchema);
const Doctor = mongoose.model("Doctor", doctorSchema);
const Appointment = mongoose.model("Appointment", appointmentSchema);
const LabResult = mongoose.model("LabResult", labResultSchema);

// -------------------------------
// 2️⃣ Root Route
// -------------------------------
app.get("/", (req, res) => {
  res.send("🏥 Clinic Chat Bot is running!");
});

// -------------------------------
// 3️⃣ CRUD for Patients
// -------------------------------

// Create patient
app.post("/patients", async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.json(patient);
});

// Read all patients
app.get("/patients", async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

// Read one patient
app.get("/patients/:id", async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  res.json(patient);
});

// Update patient
app.put("/patients/:id", async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(patient);
});

// Delete patient
app.delete("/patients/:id", async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: "Patient deleted" });
});

// -------------------------------
// 4️⃣ CRUD for Doctors
// -------------------------------
app.post("/doctors", async (req, res) => {
  const doctor = new Doctor(req.body);
  await doctor.save();
  res.json(doctor);
});

app.get("/doctors", async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});

app.get("/doctors/:id", async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  res.json(doctor);
});

app.put("/doctors/:id", async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doctor);
});

app.delete("/doctors/:id", async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: "Doctor deleted" });
});

// -------------------------------
// 5️⃣ CRUD for Appointments
// -------------------------------
app.post("/appointments", async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.json(appointment);
});

app.get("/appointments", async (req, res) => {
  const appointments = await Appointment.find().populate("patient doctor");
  res.json(appointments);
});

app.get("/appointments/:id", async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate("patient doctor");
  res.json(appointment);
});

app.put("/appointments/:id", async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(appointment);
});

app.delete("/appointments/:id", async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Appointment deleted" });
});

// -------------------------------
// 6️⃣ CRUD for Lab Results
// -------------------------------
app.post("/lab-results", async (req, res) => {
  const labResult = new LabResult(req.body);
  await labResult.save();
  res.json(labResult);
});

app.get("/lab-results", async (req, res) => {
  const results = await LabResult.find().populate("patient");
  res.json(results);
});

app.get("/lab-results/:id", async (req, res) => {
  const result = await LabResult.findById(req.params.id).populate("patient");
  res.json(result);
});

app.put("/lab-results/:id", async (req, res) => {
  const result = await LabResult.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(result);
});

app.delete("/lab-results/:id", async (req, res) => {
  await LabResult.findByIdAndDelete(req.params.id);
  res.json({ message: "Lab result deleted" });
});

export default app;
