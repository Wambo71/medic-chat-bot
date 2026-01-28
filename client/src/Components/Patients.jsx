import React, { useEffect, useState } from "react";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch patients
  const getPatients = async () => {
    const res = await fetch("/patients");
    const data = await res.json();
    setPatients(data);
  };

  useEffect(() => {
    getPatients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Update existing
      await fetch(`/patients/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setEditingId(null);
    } else {
      // Create new
      await fetch("/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setFormData({ name: "", phone: "", email: "" });
    getPatients();
  };

  const handleEdit = (patient) => {
    setFormData({ name: patient.name, phone: patient.phone, email: patient.email });
    setEditingId(patient._id);
  };

  const handleDelete = async (id) => {
    await fetch(`/patients/${id}`, { method: "DELETE" });
    getPatients();
  };

  // Filtered list
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  return (
    <div>
      <h2>Patients</h2>

      <input
        type="text"
        placeholder="Search by name or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
      />

      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <button type="submit">{editingId ? "Update Patient" : "Add Patient"}</button>
      </form>

      <ul>
        {filteredPatients.map((p) => (
          <li key={p._id}>
            {p.name} - {p.phone} - {p.email}{" "}
            <button onClick={() => handleEdit(p)}>Edit</button>{" "}
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Patients;
