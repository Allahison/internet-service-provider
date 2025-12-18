import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import pricingRoutes from "./routes/pricing.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();

// 🔹 CORS (Allow frontend URLs)
const allowedOrigins = [
  "https://internet-service-provider-rho.vercel.app", // main frontend
  "https://internet-service-provider-kev1pv5kz-muammad-arslans-projects.vercel.app", // backup domain
  "http://localhost:5173" // local dev frontend
];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true); // mobile apps or curl
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy does not allow access from ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parser
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/pricing", pricingRoutes);
app.use("/contact", contactRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", message: "🚀 Server running successfully" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ status: "ERROR", message: "Internal Server Error", error: err.message || err });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
