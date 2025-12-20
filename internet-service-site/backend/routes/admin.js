import express from "express";
import { supabase } from "../utils/supabaseClient.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only super-admin middleware
const authorizeSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "super-admin") {
    return res.status(403).json({ error: "Super-admin access only" });
  }
  next();
};

// Get all admins
router.get("/all", authenticateUser, authorizeSuperAdmin, async (req, res) => {
  try {
    // Fetch all admins from profiles table
    const { data: admins, error } = await supabase
      .from("profiles")
      .select("id, name, email, role, image")
      .eq("role", "admin"); // only admins

    if (error) return res.status(500).json({ error: error.message });

    res.json({ admins });
  } catch (err) {
    console.error("Fetch admins error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
