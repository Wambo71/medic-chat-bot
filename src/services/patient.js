import { Patient } from "../models/patient.js";

export async function findOrCreatePatient(phone) {
  try {
    let patient = await Patient.findOne({ phone });
    if (!patient) {
      patient = new Patient({ phone });
      await patient.save();
    }
    return patient;
  } catch (error) {
    throw new Error(`Failed to find or create patient: ${error.message}`);
  }
}

export async function registerPatient(phone, name, gender, dateOfBirth) {
  try {
    let patient = await Patient.findOne({ phone });
    if (patient) {
      // Update existing
      patient.name = name;
      patient.gender = gender;
      patient.dateOfBirth = dateOfBirth;
      await patient.save();
    } else {
      patient = new Patient({ phone, name, gender, dateOfBirth });
      await patient.save();
    }
    return patient;
  } catch (error) {
    throw new Error(`Failed to register patient: ${error.message}`);
  }
}