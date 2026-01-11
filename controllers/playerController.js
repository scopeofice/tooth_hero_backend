// const Player = require("../models/Player");

// /**
//  * Create new player when kid clicks Play
//  */
// exports.createPlayer = async (req, res) => {
//   try {
//     const { name, age, gender } = req.body;

//     const player = await Player.create({
//       name,
//       age,
//       gender
//     });

//     res.status(201).json(player);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create player" });
//   }
// };

// /**
//  * Update level progress & score
//  */
// exports.updateProgress = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { levelCompleted } = req.body;

//     const player = await Player.findById(id);
//     if (!player) {
//       return res.status(404).json({ error: "Player not found" });
//     }

//     // Prevent duplicate level completion
//     if (!player.levelsCompleted.includes(levelCompleted)) {
//       player.levelsCompleted.push(levelCompleted);
//       player.score += levelCompleted * 10;
//       player.currentLevel = levelCompleted + 1;
//     }

//     await player.save();
//     res.json(player);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update progress" });
//   }
// };

// /**
//  * Save feedback
//  */
// exports.submitFeedback = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { stars, text } = req.body;

//     const player = await Player.findByIdAndUpdate(
//       id,
//       { feedback: { stars, text } },
//       { new: true }
//     );

//     res.json(player);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to save feedback" });
//   }
// };
const players = require("../data/playerStore");
const { v4: uuidv4 } = require("uuid");

/**
 * Create new player
 */
exports.createPlayer = (req, res) => {
  const { name, age, gender } = req.body;

  if (!name || !age || !gender) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const id = uuidv4();

  players[id] = {
    id,
    name,
    age,
    gender,
    currentLevel: 1,
    levelsCompleted: [],
    score: 0,
    feedback: null,
  };

  res.status(201).json(players[id]);
};

/**
 * Update level progress
 */
exports.updateProgress = (req, res) => {
  const { id } = req.params;
  const { levelCompleted } = req.body;

  const player = players[id];

  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  if (!player.levelsCompleted.includes(levelCompleted)) {
    player.levelsCompleted.push(levelCompleted);
    player.score += levelCompleted * 10;
    player.currentLevel = levelCompleted + 1;
  }

  res.json(player);
};

/**
 * Save feedback
 */
exports.submitFeedback = (req, res) => {
  const { id } = req.params;
  const { stars, text } = req.body;

  const player = players[id];

  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  player.feedback = { stars, text };

  res.json(player);
};

exports.getPlayer = (req, res) => {
  const { id } = req.params;
  const player = players[id];

  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  res.json(player);
};
exports.getLeaderboardAroundPlayer = (req, res) => {
  const { playerId } = req.params;
  const range = parseInt(req.query.range) || 3;

  const allPlayers = Object.entries(players).map(([id, p]) => ({
    id,
    ...p,
  }));

  // Sort leaderboard
  allPlayers.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.levelsCompleted.length !== a.levelsCompleted.length)
      return b.levelsCompleted.length - a.levelsCompleted.length;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const index = allPlayers.findIndex((p) => p.id === playerId);

  if (index === -1) {
    return res.status(404).json({ error: "Player not found in leaderboard" });
  }

  const start = Math.max(0, index - range);
  const end = Math.min(allPlayers.length, index + range + 1);

  const sliced = allPlayers.slice(start, end).map((p, i) => ({
    rank: start + i + 1,
    id: p.id,
    name: p.name,
    score: p.score,
    levelsCleared: p.levelsCompleted.length,
  }));

  res.json({
    currentPlayerRank: index + 1,
    players: sliced,
  });
};
