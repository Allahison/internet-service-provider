export default function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  // Decode token here if using JWT. For now, assume super-admin/admin check
  // Example: attach a dummy user for testing
  req.user = { role: "admin" }; // change to 'super-admin' if needed

  if (!req.user || (req.user.role !== "admin" && req.user.role !== "super-admin")) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
}
