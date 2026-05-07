import { Radio } from "lucide-react";
import { useState } from "react";
import { navigate } from "../../hooks/useRoute";
import { Button } from "../../components/UI";

const activeTeachers = [
  { id: "teacher-1", name: "Rohan Sharma" },
  { id: "teacher-2", name: "Meera Iyer" },
];

export function SelectTeacherPage() {
  const [selectedId, setSelectedId] = useState(activeTeachers[0].id);

  const handleJoin = () => {
    if (selectedId) {
      navigate(`/live/${selectedId}`);
    }
  };
  return (
    <main className="login-page" style={{ gridTemplateColumns: "1fr" }}>
      <section className="login-panel" style={{ minHeight: "100vh" }}>
        <div className="auth-card" style={{ maxWidth: "500px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{ background: "var(--blue-soft)", color: "var(--blue)", padding: "16px", borderRadius: "50%" }}>
              <Radio size={32} />
            </div>
          </div>
          <h2 style={{ textAlign: "center" }}>Select a Classroom</h2>
          <p style={{ textAlign: "center", marginBottom: "24px" }}>Choose a teacher to view their active live broadcast.</p>
          
          <div style={{ display: "grid", gap: "16px" }} className="field">
            <select 
              value={selectedId} 
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {activeTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}'s Classroom
                </option>
              ))}
            </select>
            
            <Button className="wide" onClick={handleJoin}>
              Join Broadcast
            </Button>
          </div>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button 
              className="btn-ghost" 
              style={{ border: "none", background: "transparent", fontWeight: 700, cursor: "pointer", color: "var(--muted)" }}
              onClick={() => navigate("/login")}
            >
              &larr; Back to login
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}