import express from "express";

import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Department from "../models/Department.js";
import Service from "../models/Service.js";
import MedicationReminder from "../models/MedicationReminder.js";
import Billing from "../models/Billing.js";
import Symptom from "../models/Symptom.js";

const router = express.Router();

/* =======================
   PATIENTS
======================= */
router.post("/patients", async (req, res) => {
  const item = await Patient.create(req.body);
  res.json(item);
});

router.get("/patients", async (req, res) => {
  res.json(await Patient.find());
});

router.get("/patients/:id", async (req, res) => {
  res.json(await Patient.findById(req.params.id));
});

router.put("/patients/:id", async (req, res) => {
  res.json(
    await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

router.delete("/patients/:id", async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: "Patient deleted" });
});

/* =======================
   DOCTORS
======================= */
router.post("/doctors", async (req, res) => {
  res.json(await Doctor.create(req.body));
});

router.get("/doctors", async (req, res) => {
  res.json(await Doctor.find());
});

router.get("/doctors/:id", async (req, res) => {
  res.json(await Doctor.findById(req.params.id));
});

router.put("/doctors/:id", async (req, res) => {
  res.json(
    await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

router.delete("/doctors/:id", async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: "Doctor deleted" });
});

/* =======================
   APPOINTMENTS
======================= */
router.post("/appointments", async (req, res) => {
  res.json(await Appointment.create(req.body));
});

router.get("/appointments", async (req, res) => {
  res.json(
    await Appointment.find()
      .populate("patient")
      .populate("doctor")
  );
});

router.get("/appointments/:id", async (req, res) => {
  res.json(
    await Appointment.findById(req.params.id)
      .populate("patient")
      .populate("doctor")
  );
});

router.put("/appointments/:id", async (req, res) => {
  res.json(
    await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

router.delete("/appointments/:id", async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Appointment deleted" });
});

/* =======================
   DEPARTMENTS
======================= */
router.post("/departments", async (req, res) => {
  res.json(await Department.create(req.body));
});

router.get("/departments", async (req, res) => {
  res.json(await Department.find());
});

router.put("/departments/:id", async (req, res) => {
  res.json(
    await Department.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
});

router.delete("/departments/:id", async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: "Department deleted" });
});

/* =======================
   SERVICES
======================= */
router.post("/services", async (req, res) => {
  res.json(await Service.create(req.body));
});

router.get("/services", async (req, res) => {
  res.json(await Service.find());
});

router.delete("/services/:id", async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Service deleted" });
});

/* =======================
   MEDICATION REMINDERS
======================= */
router.post("/medications", async (req, res) => {
  res.json(await MedicationReminder.create(req.body));
});

router.get("/medications", async (req, res) => {
  res.json(await MedicationReminder.find().populate("patient"));
});

/* =======================
   BILLING
======================= */
router.post("/billing", async (req, res) => {
  res.json(await Billing.create(req.body));
});

router.get("/billing", async (req, res) => {
  res.json(await Billing.find().populate("patient"));
});

/* =======================
   SYMPTOMS
======================= */
router.post("/symptoms", async (req, res) => {
  res.json(await Symptom.create(req.body));
});

router.get("/symptoms", async (req, res) => {
  res.json(await Symptom.find());
});

export default router;
