import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  phone: String,
  email: String
});

export default mongoose.model("Contact", contactSchema);
