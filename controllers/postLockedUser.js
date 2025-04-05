const { tryCatch } = require("../utils/tryCatch");
const { connectDB } = require("../config/database");

const postLockedUser = tryCatch(async (req, res) => {
  const user = req.body;

  if (!user?.email || !user?.unlockTime) {
    return res.status(400).json({
      message: "Email and unlockTime are required.",
    });
  }

  const collection = await connectDB("lockedUsers");
  const existingUser = await collection.findOne({ email: user.email });

  if (existingUser) {
    await collection.updateOne(
      { email: user.email },
      {
        $set: { isLocked: true, unlockTime: user.unlockTime, date: new Date() },
      }
    );

    return res.status(200).json({
      message: "User locked successfully!",
      isLocked: true,
    });
  }

  await collection.insertOne(user);

  return res.status(200).json({
    message: "User locked successfully!",
    isLocked: true,
  });
});

module.exports = {
  postLockedUser,
};
