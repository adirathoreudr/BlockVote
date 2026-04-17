import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Portable API endpoint for both local and Vercel environments
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      const errorMsg = err.response?.data?.message || 'Server error. Please check your Vercel logs and MongoDB connection.';
      alert(`Login failed: ${errorMsg}`);
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
        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          New to BlockVote? <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
