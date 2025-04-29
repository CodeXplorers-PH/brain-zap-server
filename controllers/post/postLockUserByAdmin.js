const { ObjectId } = require("mongodb");
const { connectDB } = require("../../config/database");
const { tryCatch } = require("../../utils/tryCatch");

const postLockUserByAdmin = tryCatch(async (req, res) => {
  const { id } = req.params;
  const { unlockTime } = req.body;

  if (!id || !unlockTime) {
    return res.status(400).json({
      message: "User ID and unlockTime are required.",
    });
  }

  const usersCollection = await connectDB("users");
  const lockedUsersCollection = await connectDB("lockedUsers");

  // Step 1: Find user from `users` collection by ID
  let user = null;
  if (ObjectId.isValid(id)) {
    user = await usersCollection.findOne({ _id: new ObjectId(id) });
  }
  if (!user) {
    user = await usersCollection.findOne({ _id: id }); // fallback in case _id is stored as string
  }

  if (!user || !user.email) {
    return res
      .status(404)
      .json({ message: "User not found in users collection." });
  }

  const userEmail = user.email;

  // Step 2: Find the user in `lockedUsers` by email
  const existingLockedUser = await lockedUsersCollection.findOne({
    email: userEmail,
  });

  if (existingLockedUser) {
    // Step 3: Update if found
    await lockedUsersCollection.updateOne(
      { email: userEmail },
      {
        $set: {
          isLocked: true,
          unlockTime,
          date: new Date(),
        },
      }
    );
  } else {
    // If not found, insert new locked user
    await lockedUsersCollection.insertOne({
      email: userEmail,
      isLocked: true,
      unlockTime,
      date: new Date(),
    });
  }

  return res.status(200).json({
    message: "User locked successfully!",
    isLocked: true,
  });
});

module.exports = {
  postLockUserByAdmin,
};
