const { connectDB } = require("../../config/database");

const getScore = async () => {
  try {
    const users = await connectDB("users");
    const userInfo = await users.findOne({ email });

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    const historyCollection = await connectDB("quizHistory")
      .aggregate([
        { $match: { email } }, // Step 1: filter by email
        {
          $group: {
            _id: "$email",
            totalScore: { $sum: "$score" }, // Step 2: sum all scores for that user
          },
        },
      ])
      .toArray();

    // const totalScore =
    //   historyCollection.length > 0 ? historyCollection[0].totalScore : 0;

    // Combine both into one response
    res.status(200).json({
      userInfo,
      historyCollection,
    });
  } catch (error) {
    console.error("Error getting total score:", error);
  }
};

module.exports = { getScore };
