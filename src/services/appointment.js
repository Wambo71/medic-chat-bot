import { Appointment } from "../models/appointment.js";

export async function bookAppointment(patientId, department, date) {
  try {
    const appointment = new Appointment({
      patient: patientId,
      department,
      date,
      status: "confirmed",
    });
    await appointment.save();
    return {
      status: "confirmed",
      date,
      department,
    };
  } catch (error) {
    throw new Error(`Failed to book appointment: ${error.message}`);
  }
}
