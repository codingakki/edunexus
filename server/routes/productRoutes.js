import express from "express";
import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/auth.js";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// SECURE DOWNLOAD ROUTE
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.user;

    // check purchase
    const hasPurchased = user.purchases.some(
      (p) => p.toString() === productId
    );

    if (!hasPurchased) {
      return res
        .status(403)
        .json({ error: "Access denied. You have not purchased this item." });
    }

    // fetch product
    const product = await Product.findById(productId);
    if (!product || !product.filePath) {
      return res.status(404).json({ error: "File not found." });
    }

    // CORRECT FILE PATH (2 levels up)
    const filePath = path.join(
      __dirname,
      "../../private_notes",
      product.filePath
    );

    console.log("Downloading file from:", filePath);

    // send file
    res.download(filePath, product.filePath, (err) => {
      if (err) {
        console.error("File download error:", err);
        return res
          .status(404)
          .json({ error: "Error downloading file. File may not exist." });
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
