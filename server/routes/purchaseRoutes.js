import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/user.js";

const router = express.Router();

// body: { productIds: ["id1","id2"] }
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds) || !productIds.length) return res.status(400).json({ error: "productIds missing" });
    const user = req.user;
    // add only new purchases
    const existing = new Set(user.purchases.map(id => String(id)));
    productIds.forEach(pid => { if (!existing.has(String(pid))) user.purchases.push(pid); });
    await user.save();
    res.json({ success: true, purchases: user.purchases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
