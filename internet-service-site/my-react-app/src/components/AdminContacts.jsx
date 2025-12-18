import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminContacts({ token }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Messages fetched:", res.data.messages);
      setMessages(res.data.messages);
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
    await axios.put(
      `http://localhost:5000/contact/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchMessages();
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    await axios.delete(`http://localhost:5000/contact/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchMessages();
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="mt-5">
      <h2>📩 Contact Queries</h2>
      <table className="table table-bordered mt-3">
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
              <td>{msg.message}</td>
              <td>
                <span className={`badge bg-${msg.status === "new" ? "warning" : "success"}`}>
                  {msg.status}
                </span>
              </td>
              <td>
                <button className="btn btn-sm btn-success me-2" onClick={() => updateStatus(msg.id, "replied")}>
                  Mark Replied
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteMessage(msg.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
