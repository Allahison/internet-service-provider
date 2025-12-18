import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminForm({ email, password, onChangeEmail, onChangePassword, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div className="mb-3">
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={onChangeEmail}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={onChangePassword}
          className="form-control"
          required
        />
      </div>
      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Creating..." : "Create Admin"}
      </button>
    </form>
  );
}
