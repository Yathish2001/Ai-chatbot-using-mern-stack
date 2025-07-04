import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { name, email } = formData;

    if (!name || !email) {
      setError('Both name and email are required.');
      return;
    }

    // Simulate OTP send success
    setOtpSent(true);
    setMessage('OTP has been sent to your email.');
  };

  return (
    <div className="forgot-page">
      <style>{`
        .forgot-page {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #111;
          font-family: Arial, sans-serif;
        }
        .forgot-container {
          background-color: #1e1e1e;
          padding: 2rem;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          color: white;
          box-shadow: 0 0 15px rgba(0,0,0,0.4);
        }
        .forgot-container h2 {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .forgot-container input {
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.75rem;
          background: #2c2c2c;
          border: none;
          border-radius: 8px;
          color: white;
        }
        .forgot-container button {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1.5rem;
          background-color: #0b93f6;
          border: none;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        }
        .forgot-container p {
          margin-top: 1rem;
          text-align: center;
        }
        .forgot-container .error {
          color: #ff4c4c;
        }
        .forgot-container .success {
          color: #32cd32;
        }
        .back-link {
          color: #ccc;
          margin-top: 1rem;
          text-align: center;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>

      <div className="forgot-container">
        <h2>Forgot Password</h2>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <form onSubmit={handleSendOtp}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          <button type="submit">Send OTP</button>
        </form>

        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
          />
        )}

        <div className="back-link" onClick={() => navigate('/login')}>
          Back to Login
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
