import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './AdminNavbar.css'; 

export default function AdminNavbar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top px-4 py-3 shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <a className="navbar-brand d-flex align-items-center fs-4 fw-bold" href="#">
          <img 
            src="/logo.avif" 
            alt="Admin Logo" 
            style={{ height: "40px", width: "40px", marginRight: "10px" }} 
          />
          Admin Panel
        </a>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className={`collapse navbar-collapse ${collapsed ? "" : "show"}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link" href="#dashboard">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#admins">Admins</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#pricing">Pricing</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#messages">Messages</a>
            </li>

            {/* Logout */}
            <li className="nav-item ms-3">
              <button className="btn btn-outline-light px-4" onClick={onLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
