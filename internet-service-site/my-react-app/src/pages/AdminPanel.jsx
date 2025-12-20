import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminForm from "../components/AdminForm";
import AdminList from "../components/AdminList";
import PricingManager from "../components/PricingManager";
import AdminContacts from "../components/AdminContacts";
import Spinner from "../components/Spinner";
import Skeleton from "../components/Skeleton";
import "./admin.css";

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [fetchingAdmins, setFetchingAdmins] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [globalLoading, setGlobalLoading] = useState(true);

  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://internet-service-provider-oyoi.onrender.com";

  useEffect(() => {
    if (!storedUser?.token) {
      navigate("/login");
      return;
    }

    setUserRole(storedUser.role);

    const init = async () => {
      // Only fetch admins if super-admin
      if (storedUser.role === "super-admin") {
        await fetchAdmins();
      }
      setGlobalLoading(false);
    };

    init();
  }, [navigate, storedUser]);

  const fetchAdmins = useCallback(async () => {
    if (!storedUser?.token || storedUser.role !== "super-admin") return;

    setFetchingAdmins(true);
    try {
      const res = await axios.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });
      setAdmins(res.data.admins || []);
    } catch (err) {
      // Handle 401 silently
      if (err.response?.status === 401) {
        console.warn("Unauthorized: cannot fetch admins");
      } else {
        console.error("Fetch admins error:", err);
        alert("Failed to fetch admins");
      }
    } finally {
      setFetchingAdmins(false);
    }
  }, [API_URL, storedUser?.token, storedUser?.role]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please enter email & password");
    if (!storedUser?.token) return alert("User token missing");

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/admin/create`,
        { email, password },
        { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );
      setEmail("");
      setPassword("");
      fetchAdmins();
    } catch (err) {
      console.error("Create admin error:", err);
      alert("Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    if (!storedUser?.token) return alert("User token missing");

    try {
      await axios.delete(`${API_URL}/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });
      fetchAdmins();
    } catch (err) {
      console.error("Delete admin error:", err);
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!storedUser) return null;

  const navItems = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      ...(userRole === "super-admin"
        ? [{ id: "admins", label: "Admins", icon: "👥" }]
        : []),
      { id: "messages", label: "Messages", icon: "💬" },
      { id: "pricing", label: "Pricing", icon: "💰" },
    ],
    [userRole]
  );

  const dashboardStats = useMemo(
    () => [
      { label: "Users", value: Math.floor(Math.random() * 5000 + 1000), icon: "👥", color: "#3b82f6" },
      { label: "Revenue", value: `$${(Math.random() * 50000 + 1000).toFixed(2)}`, icon: "💰", color: "#10b981" },
      { label: "Orders", value: Math.floor(Math.random() * 1000 + 100), icon: "📦", color: "#f59e0b" },
      { label: "Messages", value: Math.floor(Math.random() * 300 + 20), icon: "💬", color: "#ef4444" },
    ],
    []
  );

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="dashboard-section">
            <h1 className="section-title">⚡ Admin Dashboard</h1>
            <div className="stats-grid">
              {dashboardStats.map((stat, i) => (
                <div className="stat-card" key={i} style={{ borderTop: `4px solid ${stat.color}` }}>
                  {globalLoading ? (
                    <Skeleton width="100%" height="120px" />
                  ) : (
                    <>
                      <div className="stat-icon">{stat.icon}</div>
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case "admins":
        return userRole === "super-admin" ? (
          <>
            <AdminForm
              email={email}
              password={password}
              onChangeEmail={(e) => setEmail(e.target.value)}
              onChangePassword={(e) => setPassword(e.target.value)}
              onSubmit={handleCreateAdmin}
              loading={loading}
            />
            <AdminList
              admins={admins}
              loading={fetchingAdmins}
              onDelete={handleDeleteAdmin}
            />
          </>
        ) : null;
      case "messages":
        return <AdminContacts token={storedUser.token} />;
      case "pricing":
        return <PricingManager user={storedUser} />;
      default:
        return null;
    }
  };

  if (globalLoading)
    return (
      <div className="global-loader">
        <Spinner />
      </div>
    );

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button
            className="close-btn mobile-only"
            onClick={() => setSidebarOpen(false)}
          >
            &times;
          </button>
        </div>
        <nav className="nav-items">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay mobile-only"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="main-content">
        <header className="top-navbar">
          <div className="admin-profile-top-left">
            <span className="admin-email">{storedUser.email}</span>
          </div>
          <button
            className="burger-btn mobile-only"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="content-area">{renderSection()}</main>
      </div>
    </div>
  );
}
