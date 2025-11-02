import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String // "student" or "teacher"
});

export default mongoose.model("Tutor", tutorSchema);
