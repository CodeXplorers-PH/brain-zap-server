const { connectDB } = require("../../config/database");
const { tryCatch } = require("../../utils/tryCatch");

const getUsersInfo = tryCatch(async (req, res) => {
  const { email } = req.params;

  const users = await connectDB("users");
  const userInfo = await users.findOne({ email });

  if (!userInfo) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
<<<<<<< HEAD
    userInfo,
=======
    // success: true,
    // email: userInfo.email,
    // name: userInfo.name,
    // photoURL: userInfo.photoURL,
    // stats: userInfo.stats || { totalPoints: 0 },
    // subscription: userInfo.subscription,
    // role: userInfo.role,
    // level: userInfo.level,
    userInfo
>>>>>>> 56da6e6c02e757bf949e0f7f287e94e9de1b5a12
  });
});

module.exports = {
  getUsersInfo,
};
