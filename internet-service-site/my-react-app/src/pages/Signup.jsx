import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState(""); // User's full name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please enter name, email, and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        name,
        email,
        password,
      });

      // Optional: Save user info in localStorage
      const userData = res.data.user;
      if (userData) {
        localStorage.setItem("user", JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: res.data.role,
          token: res.data.token || null
        }));
      }

      alert(res.data.message || "Signup successful. Redirecting to login...");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h1 className="mb-4 text-center">User Signup</h1>
      <form onSubmit={handleSignup}>
        {/* Name input */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email input */}
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-success w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-primary">
          Login here
        </Link>
      </p>
    </div>
  );
}
