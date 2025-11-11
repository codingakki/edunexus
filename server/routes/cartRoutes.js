import express from "express";
import Cart from "../models/Cart.js";
// Auth middleware ko import karein
import { authMiddleware } from "../middleware/auth.js"; 

const router = express.Router();

// 🛒 Add to Cart (POST /api/cart)
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Token se userId liya
    const userId = req.user.id; 
    const { productId, quantity = 1 } = req.body; 

    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    // === YEH HAI FIX ===
    // 'user: userId' ki jagah wapas 'userId: userId' kiya
    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      // Naya cart banaya
      // 'user: userId' ki jagah wapas 'userId: userId' kiya
      cart = new Cart({ userId: userId, items: [{ productId, quantity }] });
    } else {
      // Purana cart update kiya
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }
    // ==================

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    // 500 Internal Server Error (jo aapko image mein dikh raha hai)
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🛍️ Get User's Cart (GET /api/cart)
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Token se userId liya
    const userId = req.user.id;
    
    // === YEH HAI FIX ===
    // 'user: userId' ki jagah wapas 'userId: userId' kiya
    const cart = await Cart.findOne({ userId: userId }).populate({
      path: "items.productId",
      model: "Product", 
    });
    // ==================

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;