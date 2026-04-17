import React, { useState } from 'react';
import { ethers } from 'ethers';

export default function Dashboard() {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setStatus('Wallet connected successfully.');
      } catch (err) {
        setStatus('Connection failed or rejected.');
      }
    } else {
      setStatus('MetaMask not installed; please install it to proceed.');
    }
  };

  const castVote = async (candidateId) => {
    if (!account) return setStatus('Please connect wallet first.');
    // Simulated Vote Transaction
    setStatus(`Initiating transaction to vote for Candidate #${candidateId}...`);
    setTimeout(() => {
      setStatus('Vote confirmed on the blockchain! Thank you.');
    }, 2000);
  };

  return (
    <div className="dashboard-container">
      <div className="glass-panel" style={{ maxWidth: '100%' }}>
        <h1 style={{ marginTop: 0 }}>Active Election: Initial Test Election</h1>
        {account ? (
          <div>
            <p><strong>Connected:</strong> {account}</p>
            <p style={{ color: '#10b981' }}>{status}</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
                <h3>Candidate 1: Alice</h3>
                <button onClick={() => castVote(1)}>Vote Alice</button>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
                <h3>Candidate 2: Bob</h3>
                <button onClick={() => castVote(2)}>Vote Bob</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p>{status || 'Connect your Ethereum wallet to verify your identity on-chain.'}</p>
            <button onClick={connectWallet} style={{ maxWidth: '300px' }}>Connect MetaMask</button>
          </div>
        )}
      </div>
    </div>
  );
}
