import express from "express";
import { supabase } from "../utils/supabaseClient.js";

const router = express.Router();

// User signup (role fixed as 'user')
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  try {
    // Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    // Insert user profile with name and role
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({ id: userId, name, role: "user" });

    if (insertError) return res.status(500).json({ error: insertError.message });

    // Return success with user info and token
    res.status(201).json({
      message: "Signup successful",
      user: { id: userId, name, email },
      role: "user",
      token: authData.session?.access_token || null, // may be null if email confirmation is required
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Authenticate user with Supabase
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !loginData.user) {
      return res.status(401).json({ error: loginError?.message || "Invalid email or password" });
    }

    const userId = loginData.user.id;

    // Get user profile (role and name)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, name")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return res.status(500).json({ error: profileError?.message || "Failed to fetch profile" });
    }

    // Return user info and token
    res.json({
      user: { id: userId, name: profile.name, email: loginData.user.email },
      role: profile.role,
      token: loginData.session?.access_token || null,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
