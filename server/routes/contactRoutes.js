import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// ✅ Get all contact submissions
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contact messages" });
  }
});

// ✅ Submit a new contact form
router.post("/", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const saved = await newContact.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to submit message" });
  }
});

export default router;
