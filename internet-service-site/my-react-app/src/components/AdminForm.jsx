import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import Spinner from "./Spinner";

export default function AdminForm({ onAdminCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // Use environment variable

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      return alert("All fields are required");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (image) formData.append("image", image);

      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) throw new Error("User token not found");

      const res = await axios.post(
        `${API_URL}/admin/create`, // Dynamic URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message || "Admin created successfully!");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setImage(null);

      // Update parent component
      if (onAdminCreated) onAdminCreated(res.data.admin);

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to create admin";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
      <h4 className="mb-4">Add New Admin</h4>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="form-control mb-3"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-control mb-3"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-control mb-3"
        required
      />

      <label className="form-label">Profile Image (optional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="form-control mb-3"
      />

      <button className="btn btn-primary w-100" type="submit" disabled={loading}>
        {loading ? <Spinner size="small" /> : "Create Admin"}
      </button>
    </form>
  );
}
