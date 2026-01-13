const express = require("express");
const {
  createPlayer,
  updateProgress,
  submitFeedback,
  getPlayer,
  getLeaderboardAroundPlayer,
  getAllPlayers,
} = require("../controllers/playerController");

const router = express.Router();

router.get("/all", getAllPlayers);
router.post("/create", createPlayer);
router.put("/progress/:playerId", updateProgress);
router.put("/feedback/:playerId", submitFeedback);
router.get("/:playerId", getPlayer);
router.get("/leaderboard/around/:playerId", getLeaderboardAroundPlayer);

module.exports = router;
