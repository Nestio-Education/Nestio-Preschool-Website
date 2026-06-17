import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

export default function App() {
  const [screen, setScreen] = useState("login");


  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setScreen(user.role === "admin" ? "admin" : "teacher");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen("login");
  };

  if (screen === "admin") return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  if (screen === "teacher") return <TeacherDashboard user={currentUser} onLogout={handleLogout} />;
  return <LoginPage onLogin={handleLogin} />;
}