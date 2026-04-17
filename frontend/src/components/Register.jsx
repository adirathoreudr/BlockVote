import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', { email, password });
      alert('Registration successful! Please check your email for the OTP.');
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      console.error('Registration Error:', err);
      const errorMsg = err.response?.data?.message || 'Server error. Please check your Vercel logs and MongoDB connection.';
      alert(`Registration failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel">
        <h2 style={{marginTop: 0}}>Create Account</h2>
        <form onSubmit={handleRegister}>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Already have an account? <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
