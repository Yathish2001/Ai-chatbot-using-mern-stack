import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  // Fetch user feedback
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedbacks');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    }
  };

  // Add or Update Announcement
  const handleAddOrUpdate = async () => {
    if (!form.title || !form.description || (!imageFile && !isUpdating)) {
      alert('Fill all fields. Image required for new announcements.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (isUpdating) {
        await axios.put(`http://localhost:5000/api/announcements/${updateId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://localhost:5000/api/announcements', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setForm({ title: '', description: '' });
      setImageFile(null);
      setIsUpdating(false);
      setUpdateId(null);
      fetchAnnouncements();
    } catch (err) {
      console.error('Error saving announcement:', err);
    }
  };

  // Delete Announcement
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  // Edit Announcement
  const handleEdit = (announcement) => {
    setForm({ title: announcement.title, description: announcement.description });
    setIsUpdating(true);
    setUpdateId(announcement._id);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchFeedbacks();
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>{isUpdating ? 'Update Announcement' : 'Add Important Announcement'}</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={4}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <button className="submit-btn" onClick={handleAddOrUpdate}>
        {isUpdating ? 'Update Announcement' : 'Add Announcement'}
      </button>

      <h3 className="section-title">📢 Announcements</h3>
      <ul className="admin-list">
        {announcements.map((msg) => (
          <li key={msg._id} className="admin-item">
            {msg.imageUrl && <img src={msg.imageUrl} alt={msg.title} />}
            <strong>{msg.title}</strong>
            <p>{msg.description}</p>
            <div className="action-btns">
              <button className="edit-btn" onClick={() => handleEdit(msg)}>✏️ Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(msg._id)}>🗑️ Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="section-title">📝 User Feedback</h3>
      <ul className="admin-list">
        {feedbacks.map((fb) => (
          <li key={fb._id} className="admin-item">
            <strong>{fb.name}</strong> ({fb.email})<br />
            <p>{fb.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
