import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  location: { type: String, required: true },
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;
