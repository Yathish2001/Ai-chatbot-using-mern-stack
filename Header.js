import React from 'react';
import './Header.css';
import dolphin from './assets/Dolphin.gif';

const Header = () => {
  return (
    <section className="pro-hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Delphi</h1>
          <p className="hero-subtitle">Your Smart AI Assistant</p>
        </div>
        <div className="hero-dolphin">
          <img src={dolphin} alt="Dolphin AI" />
        </div>
      </div>

      <div className="hero-cards">
        <div className="card">🔍 Clarity in Conversation</div>
        <div className="card">⚡ Instant Understanding</div>
        <div className="card">🚀 Growth Through AI</div>
      </div>
    </section>
  );
};

export default Header;
