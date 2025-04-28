const { tryCatch } = require("../../utils/tryCatch");
const { connectDB } = require("../../config/database");

const getAllFeedback = tryCatch(async (req, res) => {
  const feedbackCollection = await connectDB("feedback");
  const feedbacks = await feedbackCollection.find().toArray();

  res.status(200).json({
    feedbacks,
  });
});

module.exports = { getAllFeedback };
