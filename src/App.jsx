import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

function AppRouter() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState("login");

  if (isAuthenticated) return <DashboardPage />;
  if (page === "register") return <RegisterPage onNavigate={setPage} />;
  return <LoginPage onNavigate={setPage} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
