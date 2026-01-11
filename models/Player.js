const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true
    },

    currentLevel: {
      type: Number,
      default: 1
    },

    levelsCompleted: {
      type: [Number],
      default: []
    },

    score: {
      type: Number,
      default: 0
    },

    feedback: {
      stars: {
        type: Number,
        min: 1,
        max: 5
      },
      text: {
        type: String
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
