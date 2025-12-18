// FooterComponent.jsx
import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

export default function FooterComponent() {
  return (
    <footer className="footer-premium bg-dark text-light py-5">
      <div className="container text-center text-md-start">
        <div className="row">

          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5 className="footer-brand">VelocityNet</h5>
            <p className="footer-text">
              Delivering ultra-fast, reliable, and secure internet services for homes and businesses. Stay connected with VelocityNet.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#hero" className="footer-link">Home</a></li>
              <li><a href="#features" className="footer-link">Features</a></li>
              <li><a href="#how-it-works" className="footer-link">How It Works</a></li>
              <li><a href="#pricing" className="footer-link">Pricing</a></li>
              <li><a href="#testimonials" className="footer-link">Testimonials</a></li>
              <li><a href="#cta" className="footer-link">Contact</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-md-4 mb-4">
            <h5 className="footer-heading">Follow Us</h5>
            <div className="social-links d-flex gap-3">
              <a href="https://facebook.com" className="social-link text-light" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" className="social-link text-light" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" className="social-link text-light" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

        </div>

        <div className="text-center mt-4">
          &copy; {new Date().getFullYear()} VelocityNet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
