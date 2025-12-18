import express from "express";
import supabase from "../supabaseClient.js";


const router = express.Router();

/* ===============================
   GET all pricing plans
================================ */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("pricing")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    const formattedData = (data || []).map((plan) => ({
      ...plan,
      features: Array.isArray(plan.features) ? plan.features : [],
      popular: plan.popular ?? false,
    }));

    res.json({ pricing: formattedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   CREATE pricing plan
================================ */
router.post("/", async (req, res) => {
  const { plan_name, price, features = [], popular = false } = req.body;

  if (!plan_name || !price) {
    return res.status(400).json({
      error: "plan_name and price are required",
    });
  }

  try {
    const featuresArray = Array.isArray(features)
      ? features
      : features.split(",").map((f) => f.trim());

    const { data, error } = await supabase
      .from("pricing")
      .insert([
        {
          plan_name,
          price,
          features: featuresArray,
          popular,
        },
      ])
      .select(); // ✅ NO .single()

    if (error) throw error;

    res.json({
      message: "Pricing plan created successfully",
      plan: data[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   UPDATE pricing plan (FIXED)
================================ */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { plan_name, price, features = [], popular = false } = req.body;

  if (!plan_name || !price) {
    return res.status(400).json({
      error: "plan_name and price are required",
    });
  }

  try {
    const featuresArray = Array.isArray(features)
      ? features
      : features.split(",").map((f) => f.trim());

    const { data, error } = await supabase
      .from("pricing")
      .update({
        plan_name,
        price,
        features: featuresArray,
        popular,
      })
      .eq("id", id)
      .select(); // ✅ NO .single()

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: "Pricing plan not found",
      });
    }

    res.json({
      message: "Pricing plan updated successfully",
      plan: data[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   DELETE pricing plan
================================ */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("pricing")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      message: "Pricing plan deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
