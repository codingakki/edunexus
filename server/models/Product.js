import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: String,
  price: Number,
  location: String,
  img: String,
  filePath: String,
  uploadedBy: String,
});

const Product = mongoose.model("Product", productSchema);
export default Product;
