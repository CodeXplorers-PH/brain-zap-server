const { tryCatch } = require("../../utils/tryCatch");

const getXpPoints = tryCatch(async () => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Missing email" });

  try {
    const users = req.db.collection("users");
    const user = await users.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ xp: user.xp || 0 });
  } catch (error) {
    console.error("Error fetching XP:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = {
  getXpPoints,
};
