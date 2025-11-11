import express from "express";
import Cart from "../models/Cart.js";
// 1. Auth middleware ko import karein
import { authMiddleware } from "../middleware/auth.js"; 

const router = express.Router();

// 🛒 Add to Cart (POST /api/cart)
// 2. Route ko "/add" se badal kar "/" kiya
// 3. authMiddleware add kiya
router.post("/", authMiddleware, async (req, res) => {
  try {
    // 4. userId ko req.body se nahi, token se (req.user) se liya
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body; // Default quantity 1

    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    // 5. 'userId' ki jagah 'user' use kiya (Mongoose convention)
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Naya cart banaya
      cart = new Cart({ user: userId, items: [{ productId, quantity }] });
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

    await cart.save();
    // Pura cart wapas bhejein taaki UI update ho sake (optional)
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🛍️ Get User's Cart (GET /api/cart)
// 6. Route ko "/:userId" se badal kar "/" kiya
// 7. authMiddleware add kiya
router.get("/", authMiddleware, async (req, res) => {
  try {
    // 8. userId ko req.params se nahi, token se (req.user) se liya
    const userId = req.user.id;
    
    // 9. 'userId' ki jagah 'user' use kiya
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.productId",
      model: "Product", // Model ka naam batana zaroori hai
    });

    if (!cart) {
      // Khaali cart bhejein
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;