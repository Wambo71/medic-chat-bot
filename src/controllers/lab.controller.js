import { LabResult } from "../models/labResult.js";

export async function getLabResults(patientId) {
  try {
    const results = await LabResult.find({ patient: patientId, status: "ready" });
    return results;
  } catch (error) {
    throw new Error(`Failed to retrieve lab results: ${error.message}`);
  }
}