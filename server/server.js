import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Setup dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================================
// ✅ STATIC FOLDERS
// ===============================================

// Public folder (Frontend)
app.use(express.static(path.join(__dirname, "../public")));

// Uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================================
// ✅ ADD THIS → SERVE PRIVATE NOTES FOLDER
// This allows Render to access your PDF files properly.
// ===============================================
app.use(
  "/private_notes",
  express.static(path.join(__dirname, "../private_notes"))
);

// ===============================================
// MongoDB Connection
// ===============================================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ===============================================
// Import routes
// ===============================================
import productRoutes from "./routes/productRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Use routes
app.use("/api/products", productRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

// ===============================================
// HTML Routes  (Correct path with "../public")
// ===============================================
app.get("/marketplace", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/marketplace.html"));
});

app.get("/tutor", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/tutor.html"));
});

app.get("/my-purchases", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/my-purchases.html"));
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
