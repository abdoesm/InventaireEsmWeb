import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
