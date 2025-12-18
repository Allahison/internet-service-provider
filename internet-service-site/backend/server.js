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

/* ===============================
   MIDDLEWARES
================================ */

// 🔹 CORS (DEV + PROD SAFE)
app.use(
  cors({
    origin: "*", // ⚠️ PROD: Replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔹 Body parser for JSON
app.use(express.json());

// 🔹 Optional: Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* ===============================
   ROUTES
================================ */
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/pricing", pricingRoutes);
app.use("/contact", contactRoutes);

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "🚀 Server running successfully",
  });
});

/* ===============================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    status: "ERROR",
    message: "Internal Server Error",
    error: err.message || err,
  });
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
