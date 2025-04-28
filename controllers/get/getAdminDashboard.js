const { connectDB } = require("../../config/database");

const getAdminDashboard = async (email) => {
  // Total Users
  const usersCollection = await connectDB("users");
  const users = await usersCollection.find().toArray();
  const totalUsers = users?.length || 0;

  // Total Revenue
  const totalProUsers = users.filter(
    (user) => user.subscription === "Pro"
  ).length;
  const totalEliteUsers = users.filter(
    (user) => user.subscription === "Elite"
  ).length;
  const totalFreeUsers = users.filter((user) => !user.subscription).length;


  // Total Messages
  const usersFeedback = await connectDB("feedback");
  const feedback = await usersFeedback.find().toArray();
  const totalFeedback = feedback?.length || 0;


  // Latest Feedback
  const latestFeedback = feedback
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // All data
  return {
    totalUsers,
    totalFeedback,
    totalProUsers,
    totalEliteUsers,
    totalFreeUsers,
    latestFeedback
  };
};

module.exports = {
  getAdminDashboard,
};
