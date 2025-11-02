import express from "express";
import Student from "../models/student.js";

const router = express.Router();

// POST new student registration
router.post("/", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully!" });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Failed to register student", error });
  }
});

// (Optional) GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

export default router;
