import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    default: "Not specified",
  },
  bio: {
    type: String,
    default: "No bio available.",
  },
  rate: {
    type: Number,
    required: true,
  },
});

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;