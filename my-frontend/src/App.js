import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

const App = () => {
  const [user, setUser] = useState(null);

  // ✅ Check if user is logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // Get token
    if (storedToken) {
      setUser(storedToken);
    }
  }, []);

  // ✅ Store user in state and localStorage after login
  const login = (token) => {
    setUser(token);
    localStorage.setItem('token', token);
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Redirect logged-in users to Dashboard */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        
        {/* Login Page */}
        <Route path="/login" element={<Login login={login} />} />
        
        {/* Protected Dashboard */}
        <Route path="/dashboard" element={user ? <Dashboard logout={logout} /> : <Navigate to="/login" replace />} />
        
        {/* 404 Page */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
