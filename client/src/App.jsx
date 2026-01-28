import React from "react";
import Patients from "./Components/Patients";
import Doctors from "./Components/Doctors";
import Appointments from "./Components/Appointments";
import LabResults from "./Components/LabResults";

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
