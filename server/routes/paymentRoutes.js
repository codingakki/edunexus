import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { authMiddleware } from "../middleware/auth.js";
import Cart from "../models/Cart.js";
// 1. 'Purchase' model hata diya, kyunki 'purchaseRoutes.js' use handle kar raha hai
import Product from "../models/Product.js"; 

const router = express.Router();

// Razorpay instance ko initialize karein
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================
// 1. CREATE ORDER ROUTE (Yeh bilkul sahi hai)
// ============================
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Server par cart fetch karein
    const cart = await Cart.findOne({ userId: userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Server par total amount calculate karein
    let totalAmount = 0;
    cart.items.forEach(item => {
      // Check karein ki item.productId null nahi hai (agar product delete ho gaya ho)
      if (item.productId) { 
        totalAmount += (item.productId.price || 0) * (item.quantity || 1);
      }
    });
    
    const amountInPaise = Math.round(totalAmount * 100); 

    // Razorpay order create karein
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order); // Order details frontend ko bhej dein

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Server error while creating order" });
  }
});

// ============================
// 2. VERIFY PAYMENT ROUTE (FIXED)
// ============================
router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 1. Signature ko verify karein
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // 2. Payment verification successful!
    // 'Purchase' create karna aur 'Cart' delete karna ab 'purchaseRoutes.js' ka kaam hai
    // Hum yahaan se bas success bhej denge
    
    res.json({ message: "Payment verification successful!" });

  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Server error while verifying payment" });
  }
});

export default router;