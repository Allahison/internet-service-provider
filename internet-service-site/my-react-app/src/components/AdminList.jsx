import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminList({ admins, loading, onDelete }) {
  if (loading) return <p>Loading admins...</p>;

  if (admins.length === 0) return <p>No admins found</p>;

  return (
    <ul className="list-group">
      {admins.map((admin) => (
        <li key={admin.id} className="list-group-item d-flex justify-content-between align-items-center">
          {admin.email}
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(admin.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
