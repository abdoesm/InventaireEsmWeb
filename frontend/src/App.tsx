import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./components/login/Login";
import Dashboard from "./components/pages/Dashboard";
import Setting from "./components/pages/Setting";
import Users from "./components/pages/users/UsersView";
import Articles from "./components/pages/articles/articlesView";
import Categories from "./components/pages/categories/CategoryView";
import Employers from "./components/pages/employers/EmployersView";
import FournisseurView from "./components/pages/fornisseurs/FornisseursView";
import Services from "./components/pages/a_services/ServiceView";
import LocalisationsView from "./components/pages/localisations/LocalisationsView";
import BonEntreeView from "./components/pages/bonEntrees/BonEntreeView"
import BonSortieView from "./components/pages/bonSorties/BonSortieView";
import BonRetourView from "./components/pages/bonRetours/BonRetourView";
import InventaireItemView from "./components/pages/Inventaire/InventaireItemView";
import BonSortieDetails from "./components/pages/bonSorties/BonSortieDetails";
import BonEntreeDetails from "./components/pages/bonEntrees/BonEntreeDetails";
import AdjustementView from "./components/pages/adjustement/AdjustementView";
 

interface JwtPayload {
  id: string;
  role: string;
  exp?: number; // Optional expiration field in JWT
}

export type UserType = JwtPayload | null;

export const checkAuth = (): UserType => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn("⚠️ Token expired. Logging out...");
      alert("⚠️ Session expired. Please log in again.");
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return null;
  }
};

const App = () => {
  const [user, setUser] = useState<UserType>(checkAuth());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(checkAuth());
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUser(checkAuth());
  };

  const logout = () => {
    console.log("🔹 Logging out...");
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) return <div className="loading-spinner">🔄 Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login login={login} />} />

        <Route element={<ProtectedRoute user={user} logout={logout} />}>
        <Route 
  path="/dashboard" 
  element={<Dashboard logout={logout} userRole={user?.role ?? "Guest"} />} 
/>

          <Route path="/settings" element={<Setting logout={logout} />} />
          <Route path="/users" element={<AdminRoute user={user}><Users /></AdminRoute>} />
          <Route path="/articles" element={user ? <Articles /> : <Navigate to="/login" replace />} />
          <Route path="/categories" element={user ? <Categories /> : <Navigate to="/login" replace />} />
          <Route path="/employers" element={user ? <Employers /> : <Navigate to="/login" replace />} />
          <Route path="/fornisseurs" element={user ? <FournisseurView /> : <Navigate to="/login" replace />} />
          <Route path="/services" element={user ? <Services /> : <Navigate to="/login" replace />} />
          <Route path="/localisations" element={user ? <LocalisationsView /> : <Navigate to="/login" replace />} />

          <Route path="/bonentrees" element={user ? <BonEntreeView /> : <Navigate to="/login" replace />} />
          <Route path="/bonentree/:id" element={user ? <BonEntreeDetails /> : <Navigate to="/login" replace />} />
          
          <Route path="/bonsorties" element={user ? <BonSortieView /> : <Navigate to="/login" replace />} />
          <Route path="/bonsorties/:id" element={user ? <BonSortieDetails /> : <Navigate to="/login" replace />} />

          <Route path="/bonretours" element={user ? <BonRetourView /> : <Navigate to="/login" replace />} />
          <Route path="/inventaire" element={user ? <InventaireItemView /> : <Navigate to="/login" replace />} />

          <Route path="/adjustment" element={user ? <AdjustementView /> : <Navigate to="/login" replace />} />
        </Route>

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

// ✅ Generic Protected Route Wrapper
const ProtectedRoute: React.FC<{ user: UserType; logout: () => void }> = ({ user }) => {
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// ✅ Admin-only Route Wrapper
const AdminRoute: React.FC<{ user: UserType; children: React.ReactNode }> = ({ user, children }) => {
  return user?.role === "Admin" ? children : <div>🚫 You are not authorized to access this page.</div>;
};

export default App;
