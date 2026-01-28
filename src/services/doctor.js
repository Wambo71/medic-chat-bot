import { Doctor } from "../models/doctor.js";

export async function getAvailableDoctors() {
  try {
    const doctors = await Doctor.find({ available: true });
    return doctors.map(doc => `${doc.name} - ${doc.specialty}`);
  } catch (error) {
    throw new Error(`Failed to fetch doctors: ${error.message}`);
  }
}
