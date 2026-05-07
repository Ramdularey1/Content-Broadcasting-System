import { BarChart3, FileCheck2, FilePlus2, Files, LogOut, Radio, School } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { navigate } from "../hooks/useRoute";

const nav = {
  teacher: [
    { label: "Dashboard", path: "/teacher/dashboard", icon: BarChart3 },
    { label: "Upload", path: "/teacher/upload", icon: FilePlus2 },
    { label: "My Content", path: "/teacher/content", icon: Files },
    { label: "Live Page", path: "/live/teacher-1", icon: Radio },
  ],
  principal: [
    { label: "Dashboard", path: "/principal/dashboard", icon: BarChart3 },
    { label: "Approvals", path: "/principal/approvals", icon: FileCheck2 },
    { label: "All Content", path: "/principal/content", icon: Files },
  ],
};

export function AppLayout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const items = nav[user?.role] || [];
  const path = window.location.pathname;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => navigate(`/${user.role}/dashboard`)}>
          <School size={25} />
          <div>
            <strong>Broadcast</strong>
            <span>Campus CMS</span>
          </div>
        </div>
        <nav>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button className={path === item.path ? "active" : ""} key={item.path} onClick={() => navigate(item.path)}>
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button className="logout" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="profile-chip">
            <span>{user?.name?.slice(0, 1)}</span>
            <div>
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
