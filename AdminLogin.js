import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const hardcodedKey = '123'; // 🔒 Change this to your secret key

    if (secretKey === hardcodedKey) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid secret key. Please try again.');
    }
  };

  return (
    <div className="admin-container">
      <h2>🔐 Admin Login</h2>
      <input
        type="password"
        placeholder="Enter Secret Key"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
      />
      <button className="submit-btn" onClick={handleLogin}>Unlock</button>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

export default AdminLogin;
