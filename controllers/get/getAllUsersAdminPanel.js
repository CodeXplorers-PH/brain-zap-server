const { tryCatch } = require("../../utils/tryCatch");
const { connectDB } = require("../../config/database");

const getAllUsersAdminPanel = tryCatch(async (req, res) => {
  const usersCollection = await connectDB("users");
  const users = await usersCollection
    .find(
      {},
      {
        projection: {
          email: 1,
          name: 1,
          photoURL: 1,
          _id: 1,
          role: 1,
        },
      }
    )
    .toArray();

  res.status(200).json({
    success: true,
    users,
  });
});

module.exports = { getAllUsersAdminPanel };
