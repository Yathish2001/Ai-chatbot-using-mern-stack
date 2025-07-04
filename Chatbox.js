import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import ccVideo from './assets/cc.mp4';

const Chatbox = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const dropdownRef = useRef(null);
  const feedbackRef = useRef(null);

  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [profileOpen, setProfileOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userName, setUserName] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) navigate('/login');
    else setUserName(user.name);
    fetchAnnouncements();

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        (!feedbackRef.current || !feedbackRef.current.contains(e.target))
      ) {
        setProfileOpen(false);
        setShowAnnouncements(false);
        setShowHistory(false);
        setShowFeedback(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Failed to fetch announcements');
    }
  };

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/chat/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch chat history');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const token = localStorage.getItem('token');
    const userInput = input;
    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
    setInput('');
    setIsBotTyping(true);
    setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

    try {
      const res = await axios.post('http://localhost:5000/api/chat/generate', { userInput }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const botReply = res.data.response || 'No response.';
      setIsBotTyping(false);

      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { sender: 'bot', text: botReply };
        return copy;
      });

      await axios.post('http://localhost:5000/api/chat', {
        userInput,
        botResponse: botReply,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchChatHistory();
    } catch (err) {
      console.error('Error:', err);
      setIsBotTyping(false);
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { sender: 'bot', text: 'Sorry, something went wrong.' };
        return copy;
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const sendFeedback = async () => {
    try {
      await axios.post('http://localhost:5000/api/feedback', {
        name: userName,
        message: feedback
      });
      setFeedback('');
      setFeedbackMessage('✅ Feedback sent successfully!');
      setTimeout(() => setFeedbackMessage(''), 3000);
    } catch (err) {
      setFeedbackMessage('❌ Failed to send feedback.');
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  return (
    <div className={`chatbox-page ${theme}`} style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        .bg-video { position: fixed; top: 0; left: 0; min-width: 100vw; min-height: 100vh; object-fit: cover; z-index: -1; }
        .chatbox-page.dark { background-color: #111; color: #fff; }
        .chatbox-page.light { background-color: #f4f4f4; color: #000; }
        .dropdown {
          position: absolute;
          right: 0;
          top: 2.5rem;
          background-color: white;
          color: black;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          z-index: 100;
          min-width: 200px;
        }
        .chatbox-page.dark .dropdown {
          background-color: #222;
          color: white;
        }
        .dropdown p {
          padding: 8px 10px;
          margin: 0;
          cursor: pointer;
        }
        .dropdown p:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <video autoPlay loop muted className="bg-video">
        <source src={ccVideo} type="video/mp4" />
      </video>

      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', zIndex: 1 }}>
        <div style={{ padding: '1rem', backgroundColor: theme === 'dark' ? '#111' : '#ddd', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>Welcome, {userName}!</h3>

          <div style={{ display: 'flex', gap: '10px', position: 'relative' }} ref={dropdownRef}>
            <FaBell size={22} onClick={() => setShowAnnouncements(!showAnnouncements)} style={{ cursor: 'pointer' }} title="Announcements" />
            <FaUserCircle size={24} onClick={() => setProfileOpen(!profileOpen)} style={{ cursor: 'pointer' }} title="Profile" />

            {profileOpen && (
              <div className="dropdown">
                <p><strong>{userName}</strong></p>
                <p onClick={() => { setShowHistory(!showHistory); if (!showHistory) fetchChatHistory(); }}>📜 {showHistory ? 'Hide' : 'View'} Chat History</p>
                <p onClick={() => setShowFeedback(!showFeedback)}>✍️ Feedback</p>
                <p onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}>🌙 Toggle Theme</p>
                <p onClick={handleLogout}>🚪 Logout</p>
              </div>
            )}
          </div>
        </div>

        {showAnnouncements && (
          <div style={{ backgroundColor: theme === 'dark' ? '#1c1c1c' : '#eee', padding: '1rem' }}>
            <h4>📢 Announcements</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {announcements.length === 0 ? <p>No announcements</p> : announcements.map((a, i) => (
                <div key={i} style={{ width: '180px', backgroundColor: theme === 'dark' ? '#333' : '#ccc', padding: '10px', borderRadius: '8px' }}>
                  <strong>{a.title}</strong>
                  <p>{a.description}</p>
                  {a.imageUrl && <img src={a.imageUrl} alt='' width='100%' />}
                </div>
              ))}
            </div>
          </div>
        )}

        {showHistory && (
          <div style={{ backgroundColor: theme === 'dark' ? '#222' : '#eee', padding: '1rem', maxHeight: '250px', overflowY: 'auto' }}>
            <h4>🕓 Chat History</h4>
            {chatHistory.length === 0 ? <p style={{ color: '#aaa' }}>No history.</p> : chatHistory.map((log, idx) => (
              <div key={idx} style={{ backgroundColor: theme === 'dark' ? '#333' : '#ccc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                <p><strong>You:</strong> {log.userInput}</p>
                <p><strong>Bot:</strong> {log.botResponse}</p>
              </div>
            ))}
          </div>
        )}

        {showFeedback && (
          <div ref={feedbackRef} style={{ backgroundColor: theme === 'dark' ? '#222' : '#eee', padding: '1rem' }}>
            <h4>✍️ Send Feedback</h4>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="Write your feedback..."
              style={{ width: '100%', borderRadius: '8px', padding: '10px' }}
            />
            <button onClick={sendFeedback} style={{ marginTop: '10px', padding: '6px 16px' }}>Send</button>
            {feedbackMessage && <p style={{ marginTop: '10px', color: theme === 'dark' ? 'lightgreen' : 'green' }}>{feedbackMessage}</p>}
          </div>
        )}

        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#0b93f6' : (theme === 'dark' ? '#333' : '#ccc'),
                padding: '10px 16px',
                borderRadius: '20px',
                color: msg.sender === 'user' ? '#fff' : (theme === 'dark' ? '#ddd' : '#000'),
                marginBottom: '10px',
                maxWidth: '70%'
              }}>
              {msg.text}
            </div>
          ))}
          {isBotTyping && <div style={{ fontStyle: 'italic', color: '#888', alignSelf: 'flex-start' }}>Bot is typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} style={{ display: 'flex', padding: '1rem', backgroundColor: theme === 'dark' ? '#111' : '#ccc' }}>
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flexGrow: 1, borderRadius: '10px', border: 'none', padding: '16px', fontSize: '1.05rem', backgroundColor: theme === 'dark' ? '#222' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
          />
          <button type="submit" style={{ backgroundColor: '#0b93f6', color: '#fff', border: 'none', borderRadius: '10px', padding: '0 20px', marginLeft: '10px' }}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;
