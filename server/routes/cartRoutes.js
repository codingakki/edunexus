import express from "express";
import Cart from "../models/Cart.js";
import { authMiddleware } from "../middleware/auth.js"; 

const router = express.Router();

// 🛒 Add to Cart (POST /api/cart)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; 
    const { productId, quantity = 1 } = req.body; 

    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      cart = new Cart({ userId: userId, items: [{ productId, quantity }] });
    } else {
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
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🛍️ Get User's Cart (GET /api/cart)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId: userId }).populate({
      path: "items.productId",
      model: "Product", 
    });
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ===============================================
// ✅ YEH WALA ROUTE AAPKE SERVER PAR MISSING HAI
// ===============================================
// 🔄 Update Cart Quantity (PUT /api/cart/update)
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, action } = req.body; // 'action' ya toh "increase" ya "decrease" hoga

    if (!productId || !action) {
      return res.status(400).json({ message: "Missing productId or action" });
    }

    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (action === "increase") {
      item.quantity++;
    } else if (action === "decrease") {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.items = cart.items.filter(
          (i) => i.productId.toString() !== productId
        );
      }
    }

    await cart.save();
    res.status(200).json(cart); 

  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;