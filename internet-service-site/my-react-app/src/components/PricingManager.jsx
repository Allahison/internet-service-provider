import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PricingManager({ user }) {
  const [plans, setPlans] = useState([]);
  const [planLoading, setPlanLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    features: "",
    popular: false,
  });

  // Use Vite environment variable
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ===============================
     FETCH PLANS
  ================================ */
  const fetchPlans = async () => {
    setPlanLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pricing`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const formattedPlans = (res.data.pricing || []).map((plan) => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : [],
        popular: plan.popular ?? false,
      }));
      setPlans(formattedPlans);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch pricing plans");
    } finally {
      setPlanLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* ===============================
     FORM HANDLING
  ================================ */
  const handlePlanChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPlanForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    if (!planForm.name || !planForm.price) {
      return alert("Name and Price required");
    }

    const payload = {
      plan_name: planForm.name,
      price: planForm.price,
      features: planForm.features
        ? planForm.features.split(",").map((f) => f.trim())
        : [],
      popular: planForm.popular,
    };

    try {
      if (editingPlan) {
        await axios.put(`${API_URL}/pricing/${editingPlan.id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Plan updated!");
      } else {
        await axios.post(`${API_URL}/pricing`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Plan created!");
      }

      resetForm();
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save plan");
    }
  };

  const resetForm = () => {
    setPlanForm({ name: "", price: "", features: "", popular: false });
    setEditingPlan(null);
  };

  /* ===============================
     EDIT / DELETE
  ================================ */
  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.plan_name,
      price: plan.price,
      features: plan.features.join(", "),
      popular: plan.popular,
    });
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) return;

    try {
      await axios.delete(`${API_URL}/pricing/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Plan deleted!");
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete plan");
    }
  };

  /* ===============================
     UI
  ================================ */
  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Manage Pricing Plans</h2>

      {/* FORM */}
      <form onSubmit={handlePlanSubmit} className="mb-5">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-3">
            <input
              name="name"
              value={planForm.name}
              onChange={handlePlanChange}
              placeholder="Plan Name"
              className="form-control"
              required
            />
          </div>

          <div className="col-12 col-md-2">
            <input
              name="price"
              value={planForm.price}
              onChange={handlePlanChange}
              placeholder="Price"
              className="form-control"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <input
              name="features"
              value={planForm.features}
              onChange={handlePlanChange}
              placeholder="Features (comma separated)"
              className="form-control"
            />
          </div>

          <div className="col-12 col-md-2 d-flex align-items-center">
            <input
              type="checkbox"
              name="popular"
              checked={planForm.popular}
              onChange={handlePlanChange}
              className="form-check-input me-2"
              id="popularCheckbox"
            />
            <label htmlFor="popularCheckbox" className="form-check-label">
              Popular
            </label>
          </div>

          <div className="col-12 col-md-1">
            <button className="btn btn-primary w-100">
              {editingPlan ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </form>

      {/* TABLE */}
      {planLoading ? (
        <p className="text-center">Loading plans...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Features</th>
                <th>Popular</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.plan_name}</td>
                  <td>{plan.price}</td>
                  <td>{plan.features.join(", ")}</td>
                  <td>{plan.popular ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2 mb-1"
                      onClick={() => handleEditPlan(plan)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger mb-1"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

