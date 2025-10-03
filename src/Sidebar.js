import React from 'react';
import './App.css';

function Sidebar({ isOpen }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav>
        <ul>
          <li><a href="http://localhost:3000/">Home</a></li>
          <li><a href="http://localhost:3000/product">Product</a></li>
          <li><a href="http://localhost:3000/cart">Cart</a></li>
          <li><a href="http://localhost:3000/profile">Profile</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
