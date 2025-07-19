const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  const { query } = req.body;
  try {
    const chat = await groq.chat.completions.create({
      model: "compound-beta", // or use "llama3-70b-8192"
      messages: [
        {
          role: "system",
          content: `You are a DSA tutor that returns only valid JSON. Your job is to explain data structures and algorithms visually, step-by-step.

Respond ONLY with a JSON object that includes a key "visualSteps" which is an array of steps.

Each step must include:
- "step": number
- "description": string (describes what’s happening)
- "array": array of numbers (the current state of the array)
- "highlight": array of indices being compared or swapped

Do NOT include any extra text, markdown, or code fences. Respond with ONLY the JSON object.`,

        },
        {
          role: "user",
          content: `Visualize this step-by-step in JSON format: "${query}"`,
        },
      ],
      temperature: 1,
    });

    const explanation = chat.choices[0].message.content;
    res.json({ success: true, explanation });
  } catch (error) {
    console.error("Groq error:", error.message);
    res.status(500).json({ success: false, error: "Failed to get Groq response" });
  }
});

module.exports = router;


