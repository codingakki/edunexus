import express from "express";
import Tutor from "../models/Tutor.js";

const router = express.Router();

// POST new tutor registration
router.post("/", async (req, res) => {
  try {
    const newTutor = new Tutor(req.body);
    await newTutor.save();
    res.status(201).json({ message: "Tutor registered successfully!" });
  } catch (error) {
    console.error("Error adding tutor:", error);
    res.status(500).json({ message: "Failed to register tutor", error });
  }
});

// (Optional) GET all tutors
router.get("/", async (req, res) => {
  try {
    const tutors = await Tutor.find();
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tutors", error });
  }
});

export default router;
