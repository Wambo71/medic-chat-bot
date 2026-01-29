import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Patients from "./Components/Patients";
import Doctors from "./Components/Doctors";
import Appointments from "./Components/Appointments";
import LabResults from "./Components/LabResults";
import Dashboard from "./Pages/Dashboard";
import Departments from "./Components/Departments";
import Services from "./Components/Services";
import WorkingHours from "./Components/WorkingHours";
import MedicationReminders from "./Components/MedicationReminders";
import Billing from "./Components/Billing";
import Symptoms from "./Components/Symptoms";
import Chat from "./Pages/Chat";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px", maxWidth: "1100px", margin: "auto" }}>
        {/* HEADER */}
        <h1>🏥 Hospital Chat Bot Dashboard</h1>

        {/* NAVIGATION */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={linkStyle}>Dashboard</Link>
          <Link to="/patients" style={linkStyle}>Patients</Link>
          <Link to="/doctors" style={linkStyle}>Doctors</Link>
          <Link to="/appointments" style={linkStyle}>Appointments</Link>
          <Link to="/lab-results" style={linkStyle}>Lab Results</Link>
          <Link to="/chat" style={linkStyle}>Chat</Link>
          <Link to="/departments" style={linkStyle}>Departments</Link>
          <Link to="/services" style={linkStyle}>Services</Link>
          <Link to="/working-hours" style={linkStyle}>Working Hours</Link>
          <Link to="/medications" style={linkStyle}>Medication Reminders</Link>
          <Link to="/billing" style={linkStyle}>Billing</Link>
          <Link to="/symptoms" style={linkStyle}>Symptoms</Link>

        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/lab-results" element={<LabResults />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/services" element={<Services />} />
          <Route path="/working-hours" element={<WorkingHours />} />
          <Route path="/medications" element={<MedicationReminders />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/symptoms" element={<Symptoms />} />


        </Routes>
      </div>
    </Router>
  );
}

const linkStyle = {
  marginRight: "15px",
  textDecoration: "none",
  fontWeight: "bold",
  color: "#1976d2"
};

export default App;
