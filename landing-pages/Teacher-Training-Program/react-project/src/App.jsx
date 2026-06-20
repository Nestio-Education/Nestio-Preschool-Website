import { useState } from "react";
import LoginPage        from "./pages/LoginPage";
import AdminDashboard   from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import { getStoredSession, storeSession, clearSession } from "./services/api";

/* ── Validate session has required fields ── */
function isValidSession(session) {
  if (!session) return false;
  if (!session.token) return false;
  if (!session.user) return false;
  if (!session.user.role) return false;
  return true;
}

export default function App() {
  const [initialSession] = useState(() => {
    const s = getStoredSession();
    if (!isValidSession(s)) {
      clearSession();   // wipe any stale/broken session
      return null;
    }
    return s;
  });

  const [screen, setScreen] = useState(() => {
    if (!initialSession) return "login";
    return initialSession.user.role === "admin" ? "admin" : "teacher";
  });

  const [currentUser, setCurrentUser] = useState(initialSession?.user || null);

  const handleLogin = (session) => {
    const user = session.user || session;
    if (session.token) storeSession(session);
    setCurrentUser(user);
    setScreen(user.role === "admin" ? "admin" : "teacher");
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setScreen("login");
  };

  if (screen === "admin")   return <AdminDashboard   user={currentUser} onLogout={handleLogout} />;
  if (screen === "teacher") return <TeacherDashboard user={currentUser} onLogout={handleLogout} />;
  return <LoginPage onLogin={handleLogin} />;
}