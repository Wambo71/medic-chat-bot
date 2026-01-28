import React, { useEffect, useState } from "react";

function LabResults() {
  const [labResults, setLabResults] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient: "",
    testName: "",
    result: "",
    status: "Pending",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // =====================
  // FETCH LAB RESULTS
  // =====================
  const getLabResults = async () => {
    const res = await fetch("/lab-results");
    const data = await res.json();
    setLabResults(data);
  };

  // =====================
  // FETCH PATIENTS
  // =====================
  const getPatients = async () => {
    const res = await fetch("/patients");
    const data = await res.json();
    setPatients(data);
  };

  useEffect(() => {
    getLabResults();
    getPatients();
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

    if (editingId) {
      // UPDATE
      await fetch(`/lab-results/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setEditingId(null);
    } else {
      // CREATE
      await fetch("/lab-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    }

    setFormData({
      patient: "",
      testName: "",
      result: "",
      status: "Pending",
    });

    getLabResults();
  };

  // =====================
  // EDIT LAB RESULT
  // =====================
  const handleEdit = (lab) => {
    setFormData({
      patient: lab.patient._id,
      testName: lab.testName,
      result: lab.result,
      status: lab.status,
    });
    setEditingId(lab._id);
  };

  // =====================
  // DELETE LAB RESULT
  // =====================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lab result?")) return;
    await fetch(`/lab-results/${id}`, { method: "DELETE" });
    getLabResults();
  };

  // =====================
  // SEARCH FILTER
  // =====================
  const filteredResults = labResults.filter(
    (l) =>
      l.patient?.name.toLowerCase().includes(search.toLowerCase()) ||
      l.testName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Lab Results</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by patient or test name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
      />

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <select
          name="patient"
          value={formData.patient}
          onChange={handleChange}
          required
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          name="testName"
          placeholder="Test Name (e.g. Blood Sugar)"
          value={formData.testName}
          onChange={handleChange}
          required
        />

        <textarea
          name="result"
          placeholder="Test Result"
          value={formData.result}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit">
          {editingId ? "Update Result" : "Add Result"}
        </button>
      </form>

      {/* LIST */}
      <ul>
        {filteredResults.map((l) => (
          <li key={l._id}>
            <strong>{l.patient?.name}</strong> — {l.testName}
            <br />
            📄 {l.result}
            <br />
            🧪 Status: {l.status}
            <br />
            <button onClick={() => handleEdit(l)}>Edit</button>
            <button onClick={() => handleDelete(l._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LabResults;
