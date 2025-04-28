const { tryCatch } = require("../../utils/tryCatch");
const { connectDB } = require("../../config/database");

const postQuizHistory = tryCatch(async (req, res) => {
  const { email, score, ...historyData } = req.body;

  // Step 1: Save the quiz history
  const quizHistoryCollection = await connectDB("quizHistories");
  const historyResult = await quizHistoryCollection.insertOne({
    email,
    score,
    ...historyData,
    timestamp: new Date(),
  });

  if (!historyResult.acknowledged) {
    return res.status(500).json({
      success: false,
      message: "Failed to save quiz history",
    });
  }

  // Step 2: Calculate total score by summing all quiz scores for this user
  const userQuizHistories = await quizHistoryCollection
    .find({ email })
    .toArray();
  const totalPoints = userQuizHistories.reduce(
    (sum, history) => sum + history.score,
    0
  );

  // Step 3: Update the user's totalPoints in the users collection
  const usersCollection = await connectDB("users");
  await usersCollection.updateOne(
    { email },
    { $set: { totalPoints } },
    { upsert: true }
  );

  return res.status(200).json({
    success: true,
    message: "Quiz history saved and totalPoints updated",
  });
});

module.exports = { postQuizHistory };