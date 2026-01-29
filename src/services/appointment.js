import express from "express";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// ---------------------------
// CREATE APPOINTMENT
// ---------------------------
router.post("/", async (req, res) => {
  try {
    const { patient, doctor, date, status } = req.body;

    // Optional: check if patient and doctor exist
    const existingPatient = await Patient.findById(patient);
    const existingDoctor = await Doctor.findById(doctor);
    if (!existingPatient) return res.status(404).json({ message: "Patient not found" });
    if (!existingDoctor) return res.status(404).json({ message: "Doctor not found" });

    const appointment = new Appointment({ patient, doctor, date, status });
    await appointment.save();

    // Populate patient and doctor data
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patient")
      .populate("doctor");

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error: error.message });
  }
});

// ---------------------------
// READ ALL APPOINTMENTS
// ---------------------------
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient")
      .populate("doctor");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
});

// ---------------------------
// READ ONE APPOINTMENT
// ---------------------------
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient")
      .populate("doctor");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment", error: error.message });
  }
});

// ---------------------------
// UPDATE APPOINTMENT
// ---------------------------
router.put("/:id", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("patient")
      .populate("doctor");

    if (!updated) return res.status(404).json({ message: "Appointment not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment", error: error.message });
  }
});

// ---------------------------
// DELETE APPOINTMENT
// ---------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error: error.message });
  }
});

export default router;
