const { connectDB } = require("../../config/database");
const { tryCatch } = require("../../utils/tryCatch");

const updateXP = tryCatch(async () => {
  const { email, xp, category } = req.body;
  if (!email || typeof xp !== "number") {
    return res.status(400).json({ error: "Invalid data" });
  }
  try {
    const collection = await connectDB("users");

    // Update the user: add XP and push to quiz history
    const result = await collection.updateOne(
      { email },
      {
        $inc: { xp: xp },
        $push: {
          quizHistory: {
            category,
            xpEarned: xp,
            date: new Date(),
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "XP updated successfully" });
  } catch (err) {
    console.error("XP update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = {
  updateXP,
};
