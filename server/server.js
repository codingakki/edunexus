import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================================
// ✅ YEH HAI FIX
// ===============================================
// Path ko "server/public" par point karein
app.use(express.static(path.join(__dirname, "public")));
// ===============================================

// (Uploads folder ka path bhi check kar lein, shayad yeh bhi "server/uploads" hai)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ... (MongoDB Connection) ...
mongoose
  .connect(process.env.MONGO_URI, { /* ... */ })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ... (Saare route imports) ...
import productRoutes from "./routes/productRoutes.js";
import tutorRoutes from "./routes/tutorRoutes.js";
// ... (baaki saare routes)
import paymentRoutes from "./routes/paymentRoutes.js";

// ... (Saare app.use("/api/...") routes) ...
app.use("/api/products", productRoutes);
app.use("/api/tutors", tutorRoutes);
// ... (baaki saare routes)
app.use("/api/payment", paymentRoutes);


// ===============================================
// ✅ YEH BHI FIX KIYA GAYA HAI
// ===============================================
// Sabhi file paths se "../" hata diya gaya hai
app.get("/marketplace", (req, res) => {
  res.sendFile(path.join(__dirname, "public/marketplace.html"));
});

app.get("/tutor", (req, res) => {
  res.sendFile(path.join(__dirname, "public/tutor.html"));
});

app.get("/my-purchases", (req, res) => {
  res.sendFile(path.join(__dirname, "public/my-purchases.html"));
});
// ===============================================


// ✅ 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);