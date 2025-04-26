const { ObjectId } = require("mongodb");
const { connectDB } = require("../../config/database");
const { tryCatch } = require("../../utils/tryCatch");

const getAdminDashboard = tryCatch(async (req, res) => {
  // Total Users
  const usersCollection = await connectDB("users");
  const users = await usersCollection.find().toArray();
  const totalUsers = users?.length || 0;

  //   Total Revenue
  const totalProUsers = users.filter(
    (user) => user.subscription === "Pro"
  ).length;
  const totalEliteUsers = users.filter(
    (user) => user.subscription === "Elite"
  ).length;
  const totalFreeUsers = users.filter((user) => !user.subscription).length;

  //   Total Messages
  const usersFeedback = await connectDB("feedback");
  const feedback = await usersFeedback.find().toArray();
  const totalFeedback = feedback?.length || 0;

  //   All data
  const DashboardData = {
    totalUsers,
    totalFeedback,
    totalProUsers,
    totalEliteUsers,
    totalFreeUsers,
  };

  res.status(200).json(DashboardData);
});

module.exports = {
  getAdminDashboard,
};
