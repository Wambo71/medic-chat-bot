import React, { useEffect, useState } from "react";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phone: "",
    availability: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // =====================
  // FETCH DOCTORS (READ)
  // =====================
  const getDoctors = async () => {
    const res = await fetch("/doctors");
    const data = await res.json();
    setDoctors(data);
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // =====================
  // HANDLE FORM CHANGE
  // =====================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =====================
  // CREATE / UPDATE
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      availability: formData.availability
        .split(",")
        .map((a) => a.trim()), // convert string to array
    };

    if (editingId) {
      // UPDATE
      await fetch(`/doctors/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditingId(null);
    } else {
      // CREATE
      await fetch("/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setFormData({
      name: "",
      specialization: "",
      phone: "",
      availability: "",
    });

    getDoctors();
  };

  // =====================
  // EDIT DOCTOR
  // =====================
  const handleEdit = (doctor) => {
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      availability: doctor.availability.join(", "),
    });
    setEditingId(doctor._id);
  };

  // =====================
  // DELETE DOCTOR
  // =====================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    await fetch(`/doctors/${id}`, { method: "DELETE" });
    getDoctors();
  };

  // =====================
  // SEARCH FILTER
  // =====================
  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Doctors</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by name or specialization"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
      />

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Doctor Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          name="availability"
          placeholder="Availability (Mon, Tue, Wed)"
          value={formData.availability}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Doctor" : "Add Doctor"}
        </button>
      </form>

      {/* LIST */}
      <ul>
        {filteredDoctors.map((d) => (
          <li key={d._id}>
            <strong>{d.name}</strong> — {d.specialization} <br />
            📞 {d.phone} <br />
            🕒 {d.availability.join(", ")}
            <br />
            <button onClick={() => handleEdit(d)}>Edit</button>
            <button onClick={() => handleDelete(d._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Doctors;
