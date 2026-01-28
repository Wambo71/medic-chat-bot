import express from "express";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
import Appointment from "../models/appointment.js";
import LabResult from "../models/labResult.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const stats = {
      patients: await Patient.countDocuments(),
      doctors: await Doctor.countDocuments(),
      appointmentsToday: await Appointment.countDocuments({
        date: { $gte: today, $lt: tomorrow }
      }),
      pendingLabResults: await LabResult.countDocuments({
        status: "Pending"
      })
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Dashboard stats error" });
  }
});

export default router;
