import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Example user-only route
router.get("/profile", authenticateUser, (req, res) => {
  if (req.authUser.role !== "user") return res.status(403).json({ error: "Users only" });
  res.json({ message: "User profile data", user: req.authUser });
});

export default router;
