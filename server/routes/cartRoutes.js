import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// 🛒 Add to Cart (You already have this)
router.post("/add", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.json({ message: "Product added to cart successfully!" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ===============================================
// ✅ ADD THIS NEW ROUTE
// ===============================================
// 🛍️ Get User's Cart
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find the cart and 'populate' the product details
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product", // Tell Mongoose which model to use
    });

    if (!cart) {
      // Send an empty cart structure if no cart is found
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


export default router;