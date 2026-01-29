import React, { useEffect, useState } from "react";
import axios from "axios";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [patient, setPatient] = useState("");
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [insurance, setInsurance] = useState("");

  const API_URL = "http://localhost:5000/billing";

  const fetchBills = async () => {
    const res = await axios.get(API_URL);
    setBills(res.data);
  };

  useEffect(() => { fetchBills(); }, []);

  const addBill = async () => {
    if (!patient || !service || !amount) return;
    await axios.post(API_URL, { patient, service, amount, insurance });
    setPatient(""); setService(""); setAmount(""); setInsurance("");
    fetchBills();
  };

  const deleteBill = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchBills();
  };

  return (
    <div>
      <h2>💳 Billing</h2>
      <input placeholder="Patient ID" value={patient} onChange={e=>setPatient(e.target.value)} />
      <input placeholder="Service ID" value={service} onChange={e=>setService(e.target.value)} />
      <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
      <input placeholder="Insurance" value={insurance} onChange={e=>setInsurance(e.target.value)} />
      <button onClick={addBill}>Add</button>
      <ul>
        {bills.map(b => (
          <li key={b._id}>
            {b.patient} - {b.service} - ${b.amount} - {b.insurance} [{b.status}]
            <button onClick={()=>deleteBill(b._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Billing;
