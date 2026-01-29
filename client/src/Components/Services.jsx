import React, { useEffect, useState } from "react";
import axios from "axios";

const Services = () => {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  const API_URL = "http://localhost:3000/services";

  const fetchServices = async () => {
    const res = await axios.get(API_URL);
    setServices(res.data);
  };

  useEffect(() => { fetchServices(); }, []);

  const addService = async () => {
    if (!name) return;
    await axios.post(API_URL, { name, description: desc, price });
    setName(""); setDesc(""); setPrice("");
    fetchServices();
  };

  const deleteService = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchServices();
  };

  return (
    <div>
      <h2>🛎 Services</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <button onClick={addService}>Add</button>
      <ul>
        {services.map(s => (
          <li key={s._id}>
            <b>{s.name}</b> - {s.description} - ${s.price}
            <button onClick={() => deleteService(s._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
