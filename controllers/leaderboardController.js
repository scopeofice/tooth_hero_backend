// const players = require("../data/playerStore");

// exports.getLeaderboard = (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;

//   const allPlayers = Object.entries(players).map(([id, p]) => ({
//     id,
//     ...p,
//   }));

//   allPlayers.sort((a, b) => {
//     if (b.score !== a.score) return b.score - a.score;
//     if (b.levelsCompleted.length !== a.levelsCompleted.length)
//       return b.levelsCompleted.length - a.levelsCompleted.length;
//     return new Date(a.createdAt) - new Date(b.createdAt);
//   });

//   const start = (page - 1) * limit;
//   const end = start + limit;

//   const paginated = allPlayers.slice(start, end).map((p, index) => ({
//     rank: start + index + 1,
//     id: p.id,
//     name: p.name,
//     score: p.score,
//     levelsCleared: p.levelsCompleted.length,
//   }));

//   res.json({
//     totalPlayers: allPlayers.length,
//     page,
//     totalPages: Math.ceil(allPlayers.length / limit),
//     players: paginated,
//   });
// };

const Player = require("../models/Player");

exports.getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Total players count
    const totalPlayers = await Player.countDocuments();

    // Fetch paginated & sorted players
    const players = await Player.find()
      .sort({
        score: -1,
        // tie-breaker: more levels cleared
        "levelsCompleted.length": -1,
        createdAt: 1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedPlayers = players.map((p, index) => ({
      rank: skip + index + 1,
      id: p._id,
      name: p.name,
      score: p.score,
      levelsCleared: p.levelsCompleted.length,
    }));

    res.json({
      totalPlayers,
      page,
      totalPages: Math.ceil(totalPlayers / limit),
      players: formattedPlayers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
