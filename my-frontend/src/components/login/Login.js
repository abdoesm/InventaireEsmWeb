import '../../assets/css/Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';

const Login = ({ login }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://192.168.0.146:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        localStorage.setItem('token', data.token);
        login(data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error(err);
    }
  };
  
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
   
        <Input
          label="USERNAME"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="PASSWORD"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
