import express from "express";
import { supabase } from "../utils/supabaseClient.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper middleware: Only super-admin
const authorizeSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "super-admin") {
    return res.status(403).json({ error: "Super-admin access only" });
  }
  next();
};

// Super-admin creates new admin
router.post("/create", authenticateUser, authorizeSuperAdmin, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const newAdminId = authData?.user?.id;
    if (!newAdminId) {
      return res.status(500).json({ error: "Failed to retrieve new admin ID" });
    }

    const { error: insertError } = await supabase
      .from("profiles")
      .insert({ id: newAdminId, role: "admin" });

    if (insertError) return res.status(500).json({ error: insertError.message });

    res.json({ message: "New admin created successfully", adminId: newAdminId });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Super-admin deletes an admin
router.delete("/delete/:id", authenticateUser, authorizeSuperAdmin, async (req, res) => {
  const adminId = req.params.id;

  try {
    // Delete admin from Supabase Auth
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(adminId);
    if (authDeleteError) return res.status(400).json({ error: authDeleteError.message });

    // Delete admin profile
    const { error: profileDeleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", adminId);

    if (profileDeleteError) return res.status(500).json({ error: profileDeleteError.message });

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Delete admin error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all admins (optional: for frontend listing)
router.get("/all", authenticateUser, authorizeSuperAdmin, async (req, res) => {
  try {
    const { data: admins, error } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("role", "admin");

    if (error) return res.status(500).json({ error: error.message });

    res.json({ admins });
  } catch (err) {
    console.error("Fetch admins error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
