import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Hero.css'; // Updated CSS file

export default function HeroSection() {
  return (
    <section 
      className="hero-section" 
      style={{
        background: "url('/herosectionimg.jpg') center/cover no-repeat",
        height: "100vh",
        position: "relative"
      }}
    >
      <div className="hero-overlay"></div>
      <div className="container text-center hero-content">
        <h1 className="hero-heading">
          Lightning-Fast Internet for Home & Business
        </h1>
        <p className="hero-subtext">
          Experience ultra-reliable, high-speed internet with 24/7 support. Connect seamlessly anywhere, anytime and elevate your digital experience.
        </p>
        <div className="hero-buttons">
          <a href="#pricing" className="hero-btn primary">
            Explore Plans
          </a>
          <a href="#cta" className="hero-btn secondary">
            Get Started
          </a>
        </div>
      </div>
      <div className="hero-arrow">
        &#x2193;
      </div>
    </section>
  );
}
