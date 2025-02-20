import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Login from './components/login/Login';
import Dashboard from './components/pages/Dashboard';
import Setting from './components/pages/Setting'; 
import Users from "./components/pages/users/Users"; 
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded); // 🔹 Debugging

        if (!decoded.role) {
          console.error("⚠️ Role is missing in token!");
          localStorage.removeItem('token'); // Prevent corrupted token
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    console.log("🔹 Storing Token:", token); // Debug
    localStorage.setItem('token', token);

    const decoded = jwtDecode(token);
    console.log("🔹 Decoded Token on Login:", decoded); // Debug

    setUser(decoded);
  };

  const logout = () => {
    console.log("🔹 Logging out..."); // Debug
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login login={login} />} />
        <Route path="/dashboard" element={user ? <Dashboard logout={logout} userRole={user.role} /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={user ? <Setting logout={logout} /> : <Navigate to="/login" replace />} /> {/* 🔹 Added Settings Route */}
        <Route path="/users"
  element={
    user ? (
      user.role === "Admin" ? (
        <Users />
      ) : (
        <div>🚫 You are not authorized to access this page.</div>
      )
    ) : (
      <Navigate to="/login" replace />
    )
  } />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
