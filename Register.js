import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing Login.css for shared styles
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import bbVideo from './assets/bb.mp4';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);

      if (response.status === 201) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError('Registration failed. Try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const message = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(message);
    }
  };

  return (
    <div className="login-page">
      {/* 🔁 Background Video */}
      <video autoPlay loop muted className="bg-video">
        <source src={bbVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Header />

      {/* 🔁 Glassmorphic Card */}
      <div className="login-container">
        <form className="login-card" onSubmit={handleRegister}>
          <h2>Create an Account</h2>

          {error && <p className="error-message">{error}</p>}
          {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>

          <div className="login-links">
            <button
              type="button"
              className="link-button"
              onClick={() => navigate('/')}
            >
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>

      <Footer />

      {/* 🔁 Splash with emoji */}
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-emoji">🤖</div>
        </div>
      )}
    </div>
  );
}

export default Register;
