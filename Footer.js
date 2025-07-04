// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  const infoItems = [
    {
      key: 'about',
      label: 'About',
      content: 'This is an AI chatbot created using the MERN stack created by Yatish Kumar B'
    },
    {
      key: 'privacy',
      label: 'Privacy',
      content: 'Your privacy is important to us. We do not share your data.'
    },
    {
      key: 'terms',
      label: 'Terms',
      content: 'Please use this chatbot responsibly.'
    },
    {
      key: 'contact',
      label: 'Contact',
      content: 'For inquiries, email us at support@delphi14.com.'
    }
  ];

  return (
    <footer className="login-footer">
      <div className="footer-links">
        {infoItems.map(({ key, label, content }) => (
          <div className="footer-item" key={key}>
            <span className="footer-label">{label}</span>
            <div className="footer-tooltip">{content}</div>
          </div>
        ))}
      </div>
      <p>Delphi. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
