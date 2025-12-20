import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "./Spinner";
import Skeleton from "./Skeleton";
import "./PricingManager.css";

export default function PricingManager({ user }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // new: form submit loading
  const [editingPlan, setEditingPlan] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    features: "",
    popular: false,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* Fetch Plans */
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pricing`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setPlans(
        (res.data.pricing || []).map((p) => ({
          ...p,
          features: Array.isArray(p.features) ? p.features : [],
          popular: p.popular ?? false,
        }))
      );
    } catch {
      alert("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* Form Handling */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      plan_name: form.name,
      price: form.price,
      features: form.features
        ? form.features.split(",").map((f) => f.trim())
        : [],
      popular: form.popular,
    };

    try {
      editingPlan
        ? await axios.put(`${API_URL}/pricing/${editingPlan.id}`, payload, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
        : await axios.post(`${API_URL}/pricing`, payload, {
            headers: { Authorization: `Bearer ${user.token}` },
          });

      setForm({ name: "", price: "", features: "", popular: false });
      setEditingPlan(null);
      fetchPlans();
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.plan_name,
      price: plan.price,
      features: plan.features.join(", "),
      popular: plan.popular,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete plan?")) return;
    await axios.delete(`${API_URL}/pricing/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setPlans(plans.filter((p) => p.id !== id));
  };

  return (
    <div className="pm-wrapper">
      <div className="pm-card">
        <h3 className="pm-title">Pricing Management</h3>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="pm-form row g-3">
          <div className="col-md-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Plan Name"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-2">
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="form-control"
              required
            />
          </div>

          <div className="col-md-4">
            <input
              name="features"
              value={form.features}
              onChange={handleChange}
              placeholder="Features (comma separated)"
              className="form-control"
            />
          </div>

          <div className="col-md-2 d-flex align-items-center">
            <input
              type="checkbox"
              name="popular"
              checked={form.popular}
              onChange={handleChange}
              className="form-check-input me-2"
            />
            Popular
          </div>

          <div className="col-md-1">
            <button className="btn btn-primary w-100" disabled={saving}>
              {saving ? <Spinner size="sm" /> : editingPlan ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {/* TABLE */}
        {loading ? (
          <Skeleton rows={5} cols={5} /> // Using skeleton instead of text
        ) : (
          <div className="table-responsive mt-4">
            <table className="table table-hover pm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Features</th>
                  <th>Popular</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id}>
                    <td>{p.plan_name}</td>
                    <td>{p.price}</td>
                    <td>{p.features.join(", ")}</td>
                    <td>{p.popular ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(p.id)}
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
    </div>
  );
}
