import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/user.js"; // Aap yeh use kar rahe hain
import Cart from "../models/Cart.js"; // <-- 1. Cart model ko import karein

const router = express.Router();

// body: { productIds: ["id1","id2"], payment: {...} }
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Frontend productIds aur payment object bhej raha hai
    // Hum sirf productIds le rahe hain, jo aapke logic ke hisaab se theek hai
    const { productIds } = req.body; 
    if (!Array.isArray(productIds) || !productIds.length) {
      return res.status(400).json({ error: "productIds missing" });
    }

    // authMiddleware se user mil gaya
    const user = req.user;
    
    // Naye purchases ko user ki list mein add karein
    const existing = new Set(user.purchases.map(id => String(id)));
    productIds.forEach(pid => { 
      if (!existing.has(String(pid))) {
        user.purchases.push(pid); 
      }
    });

    // User ko save karein
    await user.save();

    // === 2. YEH NAYI LINE ADD KI HAI ===
    // Purchase successful hone ke baad, user ka cart delete kar dein
    await Cart.deleteOne({ userId: user.id });
    // ===================================

    res.json({ success: true, purchases: user.purchases });

  } catch (err) {
    console.error("Error in purchase route:", err); // Server par error log karein
    res.status(500).json({ error: err.message });
  }
});

export default router;