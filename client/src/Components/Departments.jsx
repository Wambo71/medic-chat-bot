import React, { useEffect, useState } from "react";
import axios from "axios";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const API_URL = "http://localhost:3000/departments"; 

  const fetchDepartments = async () => {
    const res = await axios.get(API_URL);
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const addDepartment = async () => {
    if (!name) return;
    await axios.post(API_URL, { name, description });
    setName(""); setDescription("");
    fetchDepartments();
  };

  const deleteDepartment = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchDepartments();
  };

  return (
    <div>
      <h2>🏢 Departments</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={addDepartment}>Add</button>
      <ul>
        {departments.map(d => (
          <li key={d._id}>
            <b>{d.name}</b> - {d.description}
            <button onClick={() => deleteDepartment(d._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Departments;
