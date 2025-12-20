import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js"; // updated
import pricingRoutes from "./routes/pricing.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();
const app = express();

// 🔹 CORS
const allowedOrigins = [
  "https://internet-service-provider-rho.vercel.app",
  "https://internet-service-provider-kev1pv5kz-muammad-arslans-projects.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) return callback(new Error(`CORS blocked for ${origin}`), false);
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes); // includes /profile & /admins
app.use("/pricing", pricingRoutes);
app.use("/contact", contactRoutes);

// Health check
app.get("/", (req, res) => res.json({ status: "OK", message: "🚀 Server running successfully" }));

// 404 handler
app.use((req, res) => res.status(404).json({ status: "ERROR", message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ status: "ERROR", message: "Internal Server Error", error: err.message || err });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
