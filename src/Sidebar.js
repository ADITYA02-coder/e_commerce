import React from 'react';
import './App.css';

function Sidebar({ isOpen }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav>
        <ul>
          <li><a href="http://localhost:3000/home">🏠 Home</a></li>
          <li><a href="#about">ℹ️ About</a></li>
          <li><a href="#services">🛠️ Services</a></li>
          <li><a href="#contact">📞 Contact</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
