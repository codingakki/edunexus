import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
  },
  
  // === YEH NAYI LINE ADD KAREIN ===
  filePath: {
    type: String,
    required: true, // Zaroori hai
  }
  
});

const Product = mongoose.model("Product", productSchema);
export default Product;