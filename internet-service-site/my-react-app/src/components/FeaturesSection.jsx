import React from "react";
import { FaRocket, FaLock, FaWifi } from "react-icons/fa";
import './Features.css'; // Updated CSS file

export default function FeaturesSection() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        {/* Section Heading */}
        <h2 className="features-heading text-center">Why Choose VelocityNet</h2>
        <p className="features-subtext text-center">
          Discover the main features and benefits of our premium internet services.
        </p>

        {/* Features Row */}
        <div className="row text-center">
          {/* Feature 1 */}
          <div className="col-md-4 mb-4">
            <div className="feature-card">
              <FaRocket className="feature-icon" />
              <h5 className="feature-title">Lightning-Fast Speed</h5>
              <p className="feature-description">
                Enjoy ultra-fast internet that keeps your home and business connected seamlessly.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="col-md-4 mb-4">
            <div className="feature-card">
              <FaLock className="feature-icon" />
              <h5 className="feature-title">Secure & Reliable</h5>
              <p className="feature-description">
                Your connection is safe with robust security protocols and 24/7 monitoring.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="col-md-4 mb-4">
            <div className="feature-card">
              <FaWifi className="feature-icon" />
              <h5 className="feature-title">Wide Coverage</h5>
              <p className="feature-description">
                Stay connected everywhere with our extensive coverage and stable connectivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
