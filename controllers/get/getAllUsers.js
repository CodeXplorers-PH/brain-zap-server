const { tryCatch } = require("../../utils/tryCatch");
const { connectDB } = require("../../config/database");

const getAllUsers = tryCatch(async (req, res) => {
  const usersCollection = await connectDB("users");
  const users = await usersCollection
    .find(
      {},
      { projection: { email: 1, name: 1, totalPoints: 1, photoURL: 1, subscription: 1, _id: 0 } }
    )
    .toArray();

  res.status(200).json({
    success: true,
    users,
  });
});

module.exports = { getAllUsers };