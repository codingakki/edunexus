import express from "express";
import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/auth.js"; // <-- Auth middleware import
import path from "path"; // <-- Path module import

const router = express.Router();

// NOTE: Removed the old __dirname logic as it's not needed

// ✅ GET all products (Public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// ===============================================
// ✅ SECURE DOWNLOAD ROUTE (Fixed)
// ===============================================
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.user; // From authMiddleware

    // 1. Check if user has purchased this item
    const hasPurchased = user.purchases.some(
      (purchaseId) => purchaseId.toString() === productId
    );

    if (!hasPurchased) {
      return res.status(403).json({ error: "Access denied. You have not purchased this item." });
    }

    // 2. Find product file path from database
    const product = await Product.findById(productId);
    if (!product || !product.filePath) {
      return res.status(404).json({ error: "File not found." });
    }

    // 3. Create the full file path from the project root
    // === FIX ===
    // Use process.cwd() to get the root directory
    // Path will be: <project_root>/private_notes/filename.pdf
    const filePath = path.join(__dirname, "../private_notes", product.filePath);


    // 4. Send the file for download
    res.download(filePath, product.filePath, (err) => {
      if (err) {
        // This often happens if the file isn't found on the server's disk
        console.error("File download error:", err);
        res.status(404).json({ error: "Error downloading file. File may not exist." });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Export router
export default router;