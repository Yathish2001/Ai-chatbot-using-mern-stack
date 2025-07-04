import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Login.css';
import bbVideo from './assets/bb.mp4';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (typeof onLogin === 'function') {
        onLogin(user);
      }

      navigate('/chatbox');
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.error || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <video autoPlay loop muted className="bg-video">
        <source src={bbVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Header />

      <div className="login-container">
        <form className="login-card" onSubmit={handleLogin}>
          <h2>Login to Delphi</h2>

          {error && <p className="error-message">{error}</p>}

          <input
            type="email"
            placeholder="Email"
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
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="login-links">
            <button type="button" className="link-button" onClick={() => navigate('/forgot-password')}>
              Forgot Password?
            </button>
            <span> | </span>
            <button type="button" className="link-button" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        </form>
      </div>

      <Footer />

      {showSplash && (
        <div className="splash-screen">
          <div className="splash-emoji">🛸</div>
        </div>
      )}
    </div>
  );
};

export default Login;
