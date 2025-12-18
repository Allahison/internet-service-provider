import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminForm from "../components/AdminForm";
import AdminList from "../components/AdminList";
import AdminInfo from "../components/AdminInfo";
import PricingManager from "../components/PricingManager";
import AdminContacts from "../components/AdminContacts";

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [fetchingAdmins, setFetchingAdmins] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Backend URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL || "https://internet-service-provider-oyoi.onrender.com";

  /* ===============================
     AUTH CHECK
  ================================ */
  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
      return;
    }
    setUserRole(user.role);
    if (user.role === "super-admin") fetchAdmins();
  }, [navigate]);

  /* ===============================
     ADMIN MANAGEMENT
  ================================ */
  const fetchAdmins = async () => {
    setFetchingAdmins(true);
    try {
      const res = await axios.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch admins");
    } finally {
      setFetchingAdmins(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please enter email and password");

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/admin/create`,
        { email, password },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert(res.data.message || "Admin created successfully");
      setEmail("");
      setPassword("");
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const res = await axios.delete(`${API_URL}/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert(res.data.message || "Admin deleted successfully");
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete admin");
    }
  };

  /* ===============================
     LOGOUT
  ================================ */
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  /* ===============================
     UI SECTIONS MATCHING NAVBAR
  ================================ */
  return (
    <>
      <AdminNavbar onLogout={handleLogout} />

      <div className="container mt-5 pt-5">
        <section id="dashboard" className="mb-5">
          <h1 className="mb-4 text-center">⚡ Admin Dashboard</h1>
          <p className="text-center mb-4">
            Logged in as: <strong>{userRole}</strong>
          </p>
        </section>

        {userRole === "super-admin" && (
          <section id="admins" className="mb-5">
            <h2 className="mb-3">Create New Admin</h2>
            <div className="row justify-content-center">
              <div className="col-12 col-md-6">
                <AdminForm
                  email={email}
                  password={password}
                  onChangeEmail={(e) => setEmail(e.target.value)}
                  onChangePassword={(e) => setPassword(e.target.value)}
                  onSubmit={handleCreateAdmin}
                  loading={loading}
                />
              </div>
            </div>

            <h2 className="mt-5 mb-3">Existing Admins</h2>
            <AdminList
              admins={admins}
              loading={fetchingAdmins}
              onDelete={handleDeleteAdmin}
            />
          </section>
        )}

        {(userRole === "admin" || userRole === "super-admin") && (
          <section id="messages" className="mb-5">
            <h2 className="mb-3">Contact Messages</h2>
            <AdminContacts token={user.token} />
          </section>
        )}

        {(userRole === "admin" || userRole === "super-admin") && (
          <section id="pricing" className="mb-5">
            <h2 className="mb-3">Pricing Management</h2>
            <PricingManager user={user} />
          </section>
        )}

        <section id="userinfo" className="mb-5">
          <AdminInfo userRole={userRole} />
        </section>
      </div>
    </>
  );
}
