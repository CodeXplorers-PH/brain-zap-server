const { connectDB } = require("../../config/database");

const getAllFeedback = async (email) => {
  // Total Messages
  const usersFeedback = await connectDB("feedback");
  const feedback = await usersFeedback.find().sort({ date: -1 }).toArray();

  return feedback;
};

module.exports = {
  getAllFeedback,
};
