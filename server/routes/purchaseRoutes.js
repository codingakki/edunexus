import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/user.js";
import Cart from "../models/Cart.js"; 

const router = express.Router();

// body: { productIds: ["id1","id2"], payment: {...} }
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productIds } = req.body; 
    if (!Array.isArray(productIds) || !productIds.length) {
      return res.status(400).json({ error: "productIds missing" });
    }

    const user = req.user;
    
    // === YEH HAI FIX ===
    // Check karein ki user.purchases undefined toh nahi hai
    if (!user.purchases) {
        user.purchases = []; // Agar hai, toh use ek khaali array bana dein
    }
    // ===================
    
    // Ab yeh line safe hai aur crash nahi hogi
    const existing = new Set(user.purchases.map(id => String(id)));
    
    productIds.forEach(pid => { 
      if (!existing.has(String(pid))) {
        user.purchases.push(pid); 
      }
    });

    await user.save();

    // Purchase successful hone ke baad, user ka cart delete kar dein
    await Cart.deleteOne({ userId: user.id });

    res.json({ success: true, purchases: user.purchases });

  } catch (err) {
    console.error("Error in purchase route:", err); 
    res.status(500).json({ error: err.message }); // Client ko error bhejein
  }
});

export default router;