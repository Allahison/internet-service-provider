import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL; // Use environment variable

  // Fetch admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      const res = await axios.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Delete admin
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      await axios.delete(`${API_URL}/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdmins(prev => prev.filter(admin => admin.id !== id));
    } catch (err) {
      console.error("Failed to delete admin:", err);
    }
  };

  if (loading) return <p>Loading admins...</p>;
  if (!admins || admins.length === 0) return <p>No admins found</p>;

  return (
    <div className="list-group">
      {admins.map(admin => (
        <div
          key={admin.id}
          className="list-group-item d-flex align-items-center justify-content-between shadow-sm mb-2 rounded"
        >
          <div className="d-flex align-items-center gap-3">
            <img
              src={admin.image || "https://via.placeholder.com/50?text=Admin"}
              alt={admin.name || "Admin"}
              className="rounded-circle border"
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
            />
            <div>
              <h6 className="mb-0">{admin.name || "No Name"}</h6>
              <small className="text-muted">{admin.email || "No Email"}</small>
              <div className="text-small text-secondary">{admin.role || "Admin"}</div>
            </div>
          </div>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(admin.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
