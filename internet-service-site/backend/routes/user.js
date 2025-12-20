import express from "express";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware.js";
import { supabase } from "../utils/supabaseClient.js";

const router = express.Router();

/**
 * GET current user profile
 */
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized: No user info" });

    const profile = user.fullProfile || {};

    res.json({
      user: {
        id: user.id,
        name: profile.name || "N/A",
        email: user.email || "N/A",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
        image: profile.image || "/default-profile.png",
        role: user.role || "user",
        created_at: profile.created_at || null,
        active: profile.active ?? true,
      },
    });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

/**
 * GET all admin/super-admin users (protected route)
 */
router.get("/admins", authenticateUser, authorizeAdmin, async (req, res) => {
  try {
    const { data: admins, error } = await supabase
      .from("profiles")
      .select("*")
      .in("role", ["admin", "super-admin"]);

    if (error) {
      console.error("Fetch admins error:", error);
      return res.status(500).json({ error: "Failed to fetch admins", details: error.message });
    }

    res.json({ admins: admins || [] }); // return empty array if no admins
  } catch (err) {
    console.error("Fetch admins exception:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

export default router;
