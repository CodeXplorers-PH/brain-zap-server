const { tryCatch } = require("../../utils/tryCatch");
const { connectDB } = require("../../config/database");

const postQuizHistory = tryCatch(async (req, res) => {
  const history = req.body;
  const collection = await connectDB("quizHistories");
  const result = await collection.insertOne(history);
  if (result.acknowledged) {
    return res.status(200).json({
      message: "Quiz history saved successfully!",
    });
  } else {
    return res.status(500).json({
      message: "Failed to save quiz history.",
    });
  }
});

module.exports = {
  postQuizHistory,
};
