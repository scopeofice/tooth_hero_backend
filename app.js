const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const playerRoutes = require("./routes/playerRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error", err));

app.use("/api/player", playerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => {
  res.send("Dental Game Backend Running 🦷");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
module.exports = app;
