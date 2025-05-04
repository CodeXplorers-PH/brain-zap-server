const { connectDB } = require('../../config/database');
const { tryCatch } = require('../../utils/tryCatch');

const quizStreakDate = tryCatch(async (req, res) => {
  const { email } = req.headers;

  const collection = await connectDB('quizHistories');

  const quizzesDate = await collection
    .find({ email }, { projection: { date: 1, _id: 0 } })
    .sort({ _id: -1 })
    .toArray();

  res.send(quizzesDate);
});

module.exports = { quizStreakDate };
