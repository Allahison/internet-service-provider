import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import Skeleton from "../components/Skeleton";
import "./AdminContacts.css"; // We'll style it here

export default function AdminContacts({ token }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err.response || err);
      alert("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await axios.put(
        `${API_URL}/contact/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status } : msg))
      );
    } catch (err) {
      console.error("Failed to update status:", err.response || err);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${API_URL}/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err.response || err);
      alert("Failed to delete message");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="contacts-section">
      <h2 className="section-title">📩 Contact Queries</h2>

      {loading ? (
        <Skeleton rows={5} cols={5} height="60px" gap="12px" />
      ) : messages.length === 0 ? (
        <p className="no-messages">No messages found.</p>
      ) : (
        <div className="table-responsive card premium-table">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td className="message-cell">{msg.message}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        msg.status === "new" ? "new" : "replied"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </td>
                  <td className="actions">
                    {msg.status !== "replied" && (
                      <button
                        className="btn btn-success btn-sm action-btn"
                        onClick={() => updateStatus(msg.id, "replied")}
                        disabled={updating === msg.id}
                      >
                        {updating === msg.id ? <Spinner size="small" /> : "Mark Replied"}
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm action-btn"
                      onClick={() => deleteMessage(msg.id)}
                      disabled={deleting === msg.id}
                    >
                      {deleting === msg.id ? <Spinner size="small" /> : "Delete"}
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
