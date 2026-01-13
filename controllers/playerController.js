
const Player = require("../models/Player");
const { v4: uuidv4 } = require("uuid");

exports.createPlayer = async (req, res) => {
  try {
    const { name, age, gender } = req.body;

    const player = await Player.create({
      playerId: uuidv4(),
      name,
      age,
      gender,
    });

    res.status(201).json({ id: player.playerId });
  } catch (err) {
    res.status(500).json({ error: "Failed to create player" });
  }
};
exports.updateProgress = async (req, res) => {
  const { playerId } = req.params;
  const { levelCompleted } = req.body;

  const player = await Player.findOne({ playerId });
  if (!player) return res.status(404).json({ error: "Player not found" });

  if (!player.levelsCompleted.includes(levelCompleted)) {
    player.levelsCompleted.push(levelCompleted);
    player.score += levelCompleted * 10;
    player.currentLevel = levelCompleted + 1;
  }

  await player.save();
  res.json(player);
};

exports.submitFeedback = async (req, res) => {
  const { playerId } = req.params;
  const { stars, text } = req.body;

  const player = await Player.findOneAndUpdate(
    { playerId },
    { feedback: { stars, text } },
    { new: true }
  );

  if (!player) return res.status(404).json({ error: "Player not found" });

  res.json(player);
};
exports.getPlayer = async (req, res) => {
  const { playerId } = req.params;
  const player = await Player.findOne({ playerId });
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }
  res.json(player);
};

exports.getLeaderboardAroundPlayer = async (req, res) => {
  const { playerId } = req.params;
  const range = parseInt(req.query.range) || 3;

  const players = await Player.find().sort({
    score: -1,
    createdAt: 1,
  });

  const index = players.findIndex((p) => p.playerId === playerId);
  if (index === -1) return res.status(404).json({ error: "Player not found" });

  const start = Math.max(0, index - range);
  const end = Math.min(players.length, index + range + 1);

  const sliced = players.slice(start, end).map((p, i) => ({
    rank: start + i + 1,
    playerId: p.playerId,
    name: p.name,
    score: p.score,
    levelsCleared: p.levelsCompleted.length,
  }));

  res.json({
    currentPlayerRank: index + 1,
    players: sliced,
  });
};

exports.getTopPlayers = async (req, res) => {
  const players = await Player.find()
    .sort({ score: -1 })
    .limit(10)
    .select("name score levelsCompleted");

  res.json(
    players.map((p, i) => ({
      rank: i + 1,
      name: p.name,
      score: p.score,
      levelsCleared: p.levelsCompleted.length,
    }))
  );
};
// GET /api/player/all
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
};
