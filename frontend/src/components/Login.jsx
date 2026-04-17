import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mocked endpoint for local development
      // const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      // localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed. Ensure backend is running and credentials are valid.');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel">
        <h2 style={{marginTop: 0}}>BlockVote Access</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Verify & Sign In</button>
        </form>
      </div>
    </div>
  );
}
