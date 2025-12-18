import React from "react";
import { FaUser, FaPlug, FaRocket } from "react-icons/fa"; // Updated icons
import './HowItWorks.css'; // Updated CSS file

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="container">
        <h2 className="how-it-works-heading text-center">How It Works</h2>
        <p className="how-it-works-subtext text-center">
          Follow these simple steps to get connected with VelocityNet Internet Services.
        </p>
        <div className="row text-center">
          {/* Step 1 */}
          <div className="col-md-4 mb-4">
            <div className="step-card">
              <FaUser className="step-icon" />
              <h5 className="step-title">Sign Up</h5>
              <p className="step-description">
                Create your VelocityNet account in seconds and choose your preferred internet plan.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="col-md-4 mb-4">
            <div className="step-card">
              <FaPlug className="step-icon" />
              <h5 className="step-title">Install</h5>
              <p className="step-description">
                Our expert technicians install the internet connection at your home or business hassle-free.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="col-md-4 mb-4">
            <div className="step-card">
              <FaRocket className="step-icon" />
              <h5 className="step-title">Connect & Surf</h5>
              <p className="step-description">
                Enjoy ultra-fast, reliable internet and stay connected seamlessly anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
