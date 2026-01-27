export async function bookAppointment(patientId, doctorId, date) {
  // Save appointment to DB
  return {
    status: "confirmed",
    date,
  };
}
