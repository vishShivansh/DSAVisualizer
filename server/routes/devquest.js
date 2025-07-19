const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  const { input, mode = "rpg" } = req.body;

  let systemPrompt = "";

  switch (mode) {
    case "blocks":
      systemPrompt = "Explain the user's code or DSA problem as block-wise steps for animation.";
      break;
    case "code-visual":
      systemPrompt = "Generate a React + Framer Motion component that visualizes this algorithm or DSA solution in animation.";
      break;
    case "basic-explanation":
      systemPrompt = "Explain the code or problem in simple, clear English.";
      break;
    case "rpg":
    default:
      systemPrompt = "You are a fantasy RPG game master. Explain the user's code or DSA problem as an epic step-by-step quest with magical items, challenges, and XP gains. Make it fun, clear, and educational.";
      break;
  }

  try {
    const chat = await groq.chat.completions.create({
      model: "qwen/qwen3-32b",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Explain this:\n\n${input}`,
        },
      ],
    });

    const explanation = chat.choices[0].message.content;
    res.json({ success: true, explanation });
  } catch (error) {
    console.error("Groq error:", error.message);
    res.status(500).json({ success: false, error: "Failed to get Groq response" });
  }
});

module.exports = router;