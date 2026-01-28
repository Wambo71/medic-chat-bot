import React, { useEffect, useState } from "react";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  // Fetch all patients
  const getPatients = async () => {
    const res = await fetch("/patients");
    const data = await res.json();
    setPatients(data);
  };

  useEffect(() => {
    getPatients();
  }, []);

  // Handle form change
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new patient
  const handleSubmit = async e => {
    e.preventDefault();
    await fetch("/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    setFormData({ name: "", phone: "", email: "" });
    getPatients();
  };

  // Delete patient
  const handleDelete = async id => {
    await fetch(`/patients/${id}`, { method: "DELETE" });
    getPatients();
  };

  return (
    <div>
      <h2>Patients</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <button type="submit">Add Patient</button>
      </form>

      <ul>
        {patients.map(p => (
          <li key={p._id}>
            {p.name} - {p.phone} - {p.email}{" "}
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Patients;
