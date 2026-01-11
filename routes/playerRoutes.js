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
router.put("/progress/:playerId", updateProgress);
router.put("/feedback/:playerId", submitFeedback);
router.get("/:playerId", getPlayer);
router.get("/leaderboard/around/:playerId", getLeaderboardAroundPlayer);

module.exports = router;
