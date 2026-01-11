const express = require("express");
const {
  createPlayer,
  updateProgress,
  submitFeedback,
  getPlayer,
  getLeaderboardAroundPlayer,
} = require("../controllers/playerController");

const router = express.Router();

router.post("/create", createPlayer);
router.put("/progress/:id", updateProgress);
router.put("/feedback/:id", submitFeedback);
router.get("/:id", getPlayer);
router.get("/leaderboard/around/:playerId", getLeaderboardAroundPlayer);

module.exports = router;
