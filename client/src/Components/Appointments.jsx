import React, { useEffect, useState } from "react";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ patient: "", doctor: "", date: "", status: "Scheduled" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch all appointments
  const getAppointments = async () => {
    const res = await fetch("/appointments");
    const data = await res.json();
    setAppointments(data);
  };

  // Fetch patients
  const getPatients = async () => {
    const res = await fetch("/patients");
    const data = await res.json();
    setPatients(data);
  };

  // Fetch doctors
  const getDoctors = async () => {
    const res = await fetch("/doctors");
    const data = await res.json();
    setDoctors(data);
  };

  // Initial load
  useEffect(() => {
    getAppointments();
    getPatients();
    getDoctors();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or Update appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      await fetch(`/appointments/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setEditingId(null);
    } else {
      // Create
      await fetch("/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }
    setFormData({ patient: "", doctor: "", date: "", status: "Scheduled" });
    getAppointments();
  };

  // Edit appointment
  const handleEdit = (appt) => {
    setFormData({
      patient: appt.patient._id,
      doctor: appt.doctor._id,
      date: new Date(appt.date).toISOString().slice(0, 16), // format for datetime-local
      status: appt.status,
    });
    setEditingId(appt._id);
  };

  // Delete appointment
  const handleDelete = async (id) => {
    await fetch(`/appointments/${id}`, { method: "DELETE" });
    getAppointments();
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(
    (a) =>
      a.patient?.name.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Appointments</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by patient or doctor"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
      />

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <select name="patient" value={formData.patient} onChange={handleChange} required>
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        <select name="doctor" value={formData.doctor} onChange={handleChange} required>
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button type="submit">{editingId ? "Update Appointment" : "Add Appointment"}</button>
      </form>

      {/* List */}
      <ul>
        {filteredAppointments.map((a) => (
          <li key={a._id}>
            {a.patient?.name} with {a.doctor?.name} on {new Date(a.date).toLocaleString()} - {a.status}
            <button onClick={() => handleEdit(a)}>Edit</button>
            <button onClick={() => handleDelete(a._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Appointments;
