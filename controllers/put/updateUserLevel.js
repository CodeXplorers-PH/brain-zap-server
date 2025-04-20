const { connectDB } = require('../../config/database');
const { tryCatch } = require('../../utils/tryCatch');

// Count Point for difficulty
const countPoint = difficulty => {
  let point =
    difficulty === 'so_hard'
      ? 1
      : difficulty === 'hard'
      ? 0.9
      : difficulty === 'medium'
      ? 0.8
      : difficulty === 'easy'
      ? 0.7
      : difficulty === 'so_easy'
      ? 0.6
      : 0.5;

  return point;
};

// Count Updated Level
const countLevel = (level = 0, difficulty, score) => {
  const difficultyPoint = countPoint(difficulty);
  const performancePoint = (score - 50) / 50;

  const updateLevel =
    level + Math.round(performancePoint * difficultyPoint * 100) / 100;

  const updatedLevel =
    updateLevel <= 0 ? 0 : updateLevel >= 10 ? 10 : updateLevel;

  return updatedLevel;
};

// Update User Level in Database
const updateUserLevel = tryCatch(async (req, res) => {
  const { score, difficulty } = req.body;
  const { email } = req.headers;

  const collection = await connectDB('users');
  const { level } = await collection.findOne({ email });

  const updatedLevel = countLevel(level, difficulty, score);

  const result = await collection.updateOne(
    { email },
    { $set: { level: updatedLevel } },
    { upsert: true }
  );

  res.send(result);
});

module.exports = { updateUserLevel };
