import { useEffect, useState } from "react";
import axios from "axios";
import "./Pricing.css";

export default function PricingSection() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await axios.get(`${API_URL}/pricing`);
        setPlans(res.data.pricing || []);
      } catch (err) {
        console.error("Failed to fetch pricing plans:", err);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  if (loading) {
    return (
      <section id="pricing" className="pricing-section text-center">
        <div className="container">
          <h4 className="loading-text">Loading pricing plans...</h4>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <div className="section-header text-center mb-5">
          <h2 className="pricing-heading">Pricing Plan</h2>
          <p className="pricing-subtitle">
            Choose a plan that fits your business needs
          </p>
        </div>

        <div className="row justify-content-center">
          {plans.length === 0 && (
            <p className="text-center">No pricing plans available</p>
          )}

          {plans.map((plan) => (
            <div className="col-lg-4 col-md-6 mb-4" key={plan.id}>
              <div className={`pricing-card ${plan.popular ? "popular" : ""}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}

                <div className="card-body text-center">
                  <h5 className="card-title">{plan.plan_name}</h5>

                  <div className="price-wrapper">
                    <span className="price">{plan.price}</span>
                    <span className="duration">/month</span>
                  </div>

                  <ul className="features-list">
                    {Array.isArray(plan.features) &&
                      plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                  </ul>

                  <button className="pricing-btn">
                    {plan.popular ? "Get Started" : "Choose Plan"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
