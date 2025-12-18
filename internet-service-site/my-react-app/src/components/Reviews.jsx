import React from "react";
import { FaStar } from "react-icons/fa";
import './Testimonials.css';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "John Doe",
      role: "CEO, TechCorp",
      quote: "VelocityNet provides blazing-fast internet and outstanding customer support. Highly recommended!",
      rating: 5,
      logo: "/2.avif", // replace with client logos if available
    },
    {
      name: "Jane Smith",
      role: "Founder, StartupX",
      quote: "Amazing connectivity! Reliable and seamless for our remote teams.",
      rating: 5,
      logo: "/1.avif",
    },
    {
      name: "Michael Lee",
      role: "Product Manager, InnovateHub",
      quote: "The internet speed and service quality are unmatched. Very satisfied!",
      rating: 4,
      logo: "/3.webp",
    },
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <h2 className="testimonials-heading text-center">What Our Clients Say</h2>
        <div className="row">
          {testimonials.map((t, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="testimonial-card">
                <img
                  src={t.logo}
                  alt={`${t.name} logo`}
                  className="client-logo"
                />
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="rating">
                  {[...Array(t.rating)].map((_, i) => (
                    <FaStar key={i} className="star-icon text-warning" />
                  ))}
                </div>
                <h5 className="client-name">{t.name}</h5>
                <small className="client-role">{t.role}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
