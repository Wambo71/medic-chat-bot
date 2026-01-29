import { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointmentsToday: 0,
    pendingLabResults: 0
  });

  useEffect(() => {
    fetch("http://localhost:3000/dashboard/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px", background: "#f4f6f8", minHeight: "100vh" }}>
      <h1>🏥 Hospital Dashboard</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>
        <StatCard title="Patients" value={stats.patients} color="#1976d2" />
        <StatCard title="Doctors" value={stats.doctors} color="#388e3c" />
        <StatCard title="Appointments Today" value={stats.appointmentsToday} color="#f57c00" />
        <StatCard title="Pending Lab Results" value={stats.pendingLabResults} color="#d32f2f" />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      borderLeft: `6px solid ${color}`
    }}>
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

export default Dashboard;
