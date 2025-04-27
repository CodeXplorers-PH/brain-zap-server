const { tryCatch } = require('../../utils/tryCatch');
const { connectDB } = require('../../config/database');

const getQuizHistory = tryCatch(async (req, res) => {
  const { email } = req.params;
  const collection = await connectDB('quizHistories');
  const result = await collection
    .find({ email: email })
    .sort({ _id: -1 })
    .toArray();
  res.status(200).send(result);
});

module.exports = {
  getQuizHistory,
};
