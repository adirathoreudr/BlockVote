import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/verify-otp', { email, otp });
      alert('Email verified successfully! You can now login.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Verification failed. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel">
        <h2 style={{marginTop: 0}}>Verify Email</h2>
        <p style={{ fontSize: '14px', marginBottom: '20px', color: 'rgba(255,255,255,0.7)' }}>
          Enter the 6-digit code sent to <strong>{email || 'your email'}</strong>
        </p>
        <form onSubmit={handleVerify}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
            readOnly={!!location.state?.email}
          />
          <input 
            type="text" 
            placeholder="6-Digit OTP" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)} 
            maxLength="6"
            required 
            style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '20px' }}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
