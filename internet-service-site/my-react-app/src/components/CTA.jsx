import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './CTASection.css';

export default function CTASection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/contact`, formData);
      alert(res.data.message || "Message sent successfully");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Send Message Error:", err.response || err);
      alert(err.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cta" className="cta-section">
      <div className="container">
        <h2 className="cta-heading text-center">Connect with VelocityNet</h2>
        <p className="cta-subtext text-center">
          Interested in premium internet services? Reach out to our team and get connected today!
        </p>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <form onSubmit={handleSubmit} className="cta-form">
              <div className="form-group mb-4">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Let us know your internet needs or questions"
                />
              </div>

              <div className="text-center">
                <button type="submit" className="cta-btn" disabled={loading}>
                  {loading ? "Sending..." : "Send Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
