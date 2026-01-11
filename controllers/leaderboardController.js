const players = require("../data/playerStore");

exports.getLeaderboard = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const allPlayers = Object.entries(players).map(([id, p]) => ({
    id,
    ...p,
  }));

  allPlayers.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.levelsCompleted.length !== a.levelsCompleted.length)
      return b.levelsCompleted.length - a.levelsCompleted.length;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = allPlayers.slice(start, end).map((p, index) => ({
    rank: start + index + 1,
    id: p.id,
    name: p.name,
    score: p.score,
    levelsCleared: p.levelsCompleted.length,
  }));

  res.json({
    totalPlayers: allPlayers.length,
    page,
    totalPages: Math.ceil(allPlayers.length / limit),
    players: paginated,
  });
};
