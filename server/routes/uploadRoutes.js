import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/uploads/product
router.post("/product", upload.single("file"), async (req, res) => {
  try {
    const { title, subject, price, location, img } = req.body;

    const product = new Product({
      title,
      subject,
      price,
      location,
      img,
      filePath: req.file ? req.file.path : null,
      uploadedBy: req.user?.id || null, // Optional: if you add auth later
    });

    await product.save();
    res.json({ message: "✅ Product uploaded successfully", product });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
