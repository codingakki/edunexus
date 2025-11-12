import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  
  // ===================================
  // ✅ YEH FIELD ADD KAREIN
  // ===================================
  purchases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product" // Yeh Mongoose ko batata hai ki 'Product' model ko refer karna hai
    }
  ]
  // ===================================

});

const User = mongoose.model("User", userSchema);
export default User;