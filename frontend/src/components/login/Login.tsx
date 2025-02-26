import '../../assets/css/Login.css';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';

interface LoginProps {
  login: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ login }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch('http://192.168.0.146:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.token) {
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        />
        <Input
          label="PASSWORD"
          name="password"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
