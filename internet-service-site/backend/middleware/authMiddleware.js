import { supabase } from "../utils/supabaseClient.js";

/**
 * Authenticate user via Bearer token
 * Attaches user info to req.user
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Get user from Supabase using token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return res.status(401).json({ error: "Invalid or expired token" });

    // Fetch user profile for role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) return res.status(401).json({ error: "Profile not found" });

    // Attach authenticated user info
    req.user = { id: user.id, role: profile.role };
    next();
  } catch (err) {
    console.error("Authentication Middleware Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Authorize roles dynamically
 * Pass an array of allowed roles: ['admin', 'super-admin']
 */
export const authorizeRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized: No user info" });

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied: Requires role ${allowedRoles.join(", ")}` });
    }

    next();
  };
};

/**
 * Convenience middlewares
 */
export const authorizeAdmin = authorizeRoles(["admin", "super-admin"]); // Admin + super-admin allowed
export const authorizeSuperAdmin = authorizeRoles(["super-admin"]); // Only super-admin
