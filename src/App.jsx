import { useEffect } from "react";
import { ToastProvider } from "./components/Toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import { navigate, useRoute } from "./hooks/useRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { AllContentPage } from "./pages/principal/AllContentPage";
import { ApprovalsPage } from "./pages/principal/ApprovalsPage";
import { PrincipalDashboard } from "./pages/principal/PrincipalDashboard";
import { LivePage } from "./pages/public/LivePage";
import { SelectTeacherPage } from "./pages/public/SelectTeacherPage";
import { MyContentPage } from "./pages/teacher/MyContentPage";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { UploadContentPage } from "./pages/teacher/UploadContentPage";

function ProtectedRoute({ role, children }) {
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user.role !== role) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [isAuthenticated, user, role]);

  if (!isAuthenticated || user.role !== role) {
    return null;
  }
  
  return children;
}

function Router() {
  const path = useRoute();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if ((path === "/" || path === "/login") && isAuthenticated) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [path, isAuthenticated, user]);

  if ((path === "/" || path === "/login") && isAuthenticated) {
    return null;
  }

  if (path === "/" || path === "/login") {
    return <LoginPage />;
  }

  if (path === "/live") {
    return <SelectTeacherPage />;
  }

  if (path.startsWith("/live/")) {
    return <LivePage teacherId={path.split("/").at(-1) || "teacher-1"} />;
  }

  const routes = {
    "/teacher/dashboard": <TeacherDashboard />,
    "/teacher/upload": <UploadContentPage />,
    "/teacher/content": <MyContentPage />,
    "/principal/dashboard": <PrincipalDashboard />,
    "/principal/approvals": <ApprovalsPage />,
    "/principal/content": <AllContentPage />,
  };

  const role = path.startsWith("/principal") ? "principal" : "teacher";
  return <ProtectedRoute role={role}>{routes[path] || routes[`/${role}/dashboard`]}</ProtectedRoute>;
}

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <ToastProvider>
          <Router />
        </ToastProvider>
      </ContentProvider>
    </AuthProvider>
  );
}
