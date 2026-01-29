import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.json(patient);
});

// READ ALL
router.get("/", async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

// READ ONE
router.get("/:id", async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  res.json(patient);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(patient);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: "Patient deleted" });
});

export default router;
