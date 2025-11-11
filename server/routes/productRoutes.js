import express from "express";
import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/auth.js"; // <-- 1. Auth middleware import kiya
import path from "path"; // <-- 2. Path module import kiya
import { fileURLToPath } from "url"; // <-- 3. Ye add karein ES modules ke liye

const router = express.Router();

// ES module setup for __dirname (agar process.cwd() kaam na kare)
const __filename = fileURLToPath(import.meta.url);
// ../routes/productRoutes.js -> ../
const __dirname = path.dirname(path.dirname(__filename));


// ✅ GET all products (Ye pehle se tha)
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
// ✅ YEH NAYA SECURE DOWNLOAD ROUTE HAI
// ===============================================
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.user; // Ye authMiddleware se mil gaya

    // 1. Check karein ki user ne yeh product khareeda hai
    // (Aapke User model mein 'purchases' array hai)
    const hasPurchased = user.purchases.some(
      (purchaseId) => purchaseId.toString() === productId
    );

    if (!hasPurchased) {
      return res.status(403).json({ error: "Access denied. You have not purchased this item." });
    }

    // 2. Product ka file path database se nikalein
    const product = await Product.findById(productId);
    if (!product || !product.filePath) {
      return res.status(404).json({ error: "File not found." });
    }

    // 3. Private folder se file ka poora path banayein
    // Path: root_folder/private_notes/filename.pdf
    const filePath = path.join(__dirname, "private_notes", product.filePath);

    // 4. User ko file stream/download karwayein
    res.download(filePath, product.filePath, (err) => {
      if (err) {
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