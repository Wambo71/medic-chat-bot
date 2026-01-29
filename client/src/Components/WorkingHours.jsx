import React, { useEffect, useState } from "react";
import axios from "axios";

const WorkingHours = () => {
  const [hours, setHours] = useState([]);
  const [department, setDepartment] = useState("");
  const [day, setDay] = useState("");
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");

  const API_URL = "http://localhost:5000/working-hours";

  const fetchHours = async () => {
    const res = await axios.get(API_URL);
    setHours(res.data);
  };

  useEffect(() => { fetchHours(); }, []);

  const addHours = async () => {
    if (!department || !day) return;
    await axios.post(API_URL, { department, day, open, close });
    setDepartment(""); setDay(""); setOpen(""); setClose("");
    fetchHours();
  };

  const deleteHours = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchHours();
  };

  return (
    <div>
      <h2>⏰ Working Hours</h2>
      <input placeholder="Department ID" value={department} onChange={e=>setDepartment(e.target.value)} />
      <input placeholder="Day" value={day} onChange={e=>setDay(e.target.value)} />
      <input placeholder="Open" value={open} onChange={e=>setOpen(e.target.value)} />
      <input placeholder="Close" value={close} onChange={e=>setClose(e.target.value)} />
      <button onClick={addHours}>Add</button>
      <ul>
        {hours.map(h => (
          <li key={h._id}>
            {h.department} - {h.day} : {h.open} - {h.close}
            <button onClick={()=>deleteHours(h._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkingHours;
