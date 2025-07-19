const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());
const explainRoute = require("./routes/explain");
const devQuestRoute = require("./routes/devquest");
app.use("/api/explain", explainRoute);
app.use("/api/devquest", devQuestRoute);

const PORT = process.env.PORT || 5000;

app.get("/api/ping", (req, res) => {
  res.json({ message: "Server is alive 🚀" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("DB error", err));
