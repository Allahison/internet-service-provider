import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css'; // Updated CSS file

export default function NavbarComponent({ onLogout }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const sections = ["hero", "features", "how-it-works", "pricing", "testimonials", "cta"];

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;

      for (let section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const offsetTop = el.offsetTop;
          const offsetBottom = offsetTop + el.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
            setActiveSection(section);
          }
        }
      }

      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "hero", label: "Home" },
    { id: "features", label: "Features" },
    { id: "how-it-works", label: "About" },
    { id: "pricing", label: "Pricing" },
    { id: "testimonials", label: "Testimonials" },
    { id: "cta", label: "Contact" },
  ];

  return (
    <nav className={`navbar navbar-expand-lg fixed-top px-5 py-3 ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
      <div className="container-fluid">
        {/* Brand */}
<a className="navbar-brand d-flex align-items-center premium-brand fs-3 fw-bold" href="#">
  <img 
    src="/logo.avif"       
    alt="VelocityNet Logo" 
    style={{ height: "40px", width: "40px", marginRight: "10px" }} 
  />
  VelocityNet
</a>

        {/* Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.id}>
                <button
                  className={`nav-link btn btn-link mx-2 px-2 text-white nav-link-premium ${
                    activeSection === link.id ? "active-link-premium" : ""
                  }`}
                  onClick={() => scrollToSection(link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}

            <li className="nav-item ms-3">
              <button className="btn btn-glow px-4 py-2" onClick={onLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}