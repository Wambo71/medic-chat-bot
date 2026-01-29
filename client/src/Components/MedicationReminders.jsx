import React, { useEffect, useState } from "react";
import axios from "axios";

const MedicationReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [patient, setPatient] = useState("");
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");

  const API_URL = "http://localhost:3000/medications";

  const fetchReminders = async () => {
    const res = await axios.get(API_URL);
    setReminders(res.data);
  };

  useEffect(() => { fetchReminders(); }, []);

  const addReminder = async () => {
    if (!patient || !medicine) return;
    await axios.post(API_URL, { patient, medicine, dosage, time });
    setPatient(""); setMedicine(""); setDosage(""); setTime("");
    fetchReminders();
  };

  const deleteReminder = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchReminders();
  };

  return (
    <div>
      <h2>💊 Medication Reminders</h2>
      <input placeholder="Patient ID" value={patient} onChange={e=>setPatient(e.target.value)} />
      <input placeholder="Medicine" value={medicine} onChange={e=>setMedicine(e.target.value)} />
      <input placeholder="Dosage" value={dosage} onChange={e=>setDosage(e.target.value)} />
      <input placeholder="Time" value={time} onChange={e=>setTime(e.target.value)} />
      <button onClick={addReminder}>Add</button>
      <ul>
        {reminders.map(r => (
          <li key={r._id}>
            {r.patient} - {r.medicine} at {r.time}
            <button onClick={()=>deleteReminder(r._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicationReminders;
