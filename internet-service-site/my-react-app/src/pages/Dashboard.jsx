import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavbarComponent from "../components/Navbar";
import FooterComponent from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/About"; // original import
import PricingSection from "../components/Pricing";
import TestimonialsSection from "../components/Reviews";
import CTASection from "../components/CTA";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userString);
      setUser(parsedUser);
    } catch (err) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <>
      {/* Navbar */}
      <NavbarComponent user={user} onLogout={handleLogout} />

      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      

      {/* Features Section */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* How It Works / About Section */}
      <section id="how-it-works">
        <HowItWorksSection />
      </section>

      {/* Pricing Section */}
      <section id="plans">
        <PricingSection />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      
      {/* Call-to-Action Section */}
      <section id="cta">
        <CTASection />
      </section>

      {/* Footer */}
      <FooterComponent />
    </>
  );
}
