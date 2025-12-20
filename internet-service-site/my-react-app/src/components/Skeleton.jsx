import "./skeleton.css"; // Optional: Add custom skeleton styles if needed

export default function Skeleton({ loading, width = "100%", height = "20px", children }) {
  if (loading) {
    return <div className="skeleton" style={{ width, height }}></div>;
  }
  return children;
}