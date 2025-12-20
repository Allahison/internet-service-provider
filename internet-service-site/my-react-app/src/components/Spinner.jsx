import "./spinner.css"; // Optional: Add custom spinner styles if needed

export default function Spinner({ size = "medium" }) {
  return (
    <div className={`spinner ${size}`} aria-label="Loading">
      <div className="spinner-inner"></div>
    </div>
  );
}