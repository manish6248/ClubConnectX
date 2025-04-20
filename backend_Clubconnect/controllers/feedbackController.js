// controllers/feedback.controller.js
import Feedback from "../models/feedback.js";

export const submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const feedback = new Feedback({ message });
    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Feedback submission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ data: feedbacks });
  } catch (error) {
    console.error("Fetching feedback error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
