import express from "express";
import supabase from "../supabaseClient.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

/* ===============================
   USER → SEND MESSAGE
================================ */
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields required" });
  }

  const { error } = await supabase
    .from("contact_messages")
    .insert([{ name, email, message, status: "new" }]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Message sent successfully" });
});

/* ===============================
   ADMIN → GET ALL MESSAGES
================================ */
router.get("/", verifyAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Supabase fetch error:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ messages: data });
});

/* ===============================
   ADMIN → UPDATE STATUS
================================ */
router.put("/:id", verifyAdmin, async (req, res) => {
  const { status } = req.body;
  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Status updated" });
});

/* ===============================
   ADMIN → DELETE MESSAGE
================================ */
router.delete("/:id", verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Message deleted" });
});

export default router;
