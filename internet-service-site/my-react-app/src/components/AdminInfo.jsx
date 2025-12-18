import React from "react";

export default function AdminInfo({ userRole }) {
  if (userRole === "admin") {
    return (
      <p className="text-muted mt-3">
        You have limited access. Only super-admins can manage accounts.
      </p>
    );
  }
  return null;
}
