import React, { useEffect, useState } from "react";
import axios from "axios";

const Symptoms = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [patient, setPatient] = useState("");
  const [description, setDescription] = useState("");

  const API_URL = "http://localhost:5000/symptoms";

  const fetchSymptoms = async () => {
    const res = await axios.get(API_URL);
    setSymptoms(res.data);
  };

  useEffect(() => { fetchSymptoms(); }, []);

  const addSymptom = async () => {
    if (!patient || !description) return;
    await axios.post(API_URL, { patient, description });
    setPatient(""); setDescription("");
    fetchSymptoms();
  };

  const deleteSymptom = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchSymptoms();
  };

  return (
    <div>
      <h2>🩺 Symptoms</h2>
      <input placeholder="Patient ID" value={patient} onChange={e=>setPatient(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <button onClick={addSymptom}>Add</button>
      <ul>
        {symptoms.map(s => (
          <li key={s._id}>
            {s.patient} - {s.description} ({new Date(s.dateReported).toLocaleDateString()})
            <button onClick={()=>deleteSymptom(s._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Symptoms;
