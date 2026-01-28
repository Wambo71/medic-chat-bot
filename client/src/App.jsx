import React from "react";
import Patients from "./components/Patients";
import Doctors from "./components/Doctors";
import Appointments from "./components/Appointments";
import LabResults from "./components/LabResults";

function App() {
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1>🏥 Hospital Chat Bot Dashboard</h1>
      <Patients />
      <Doctors />
      <Appointments />
      <LabResults />
    </div>
  );
}

export default App;
