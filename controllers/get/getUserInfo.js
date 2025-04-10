const { connectDB } = require("../../config/database");
const { tryCatch } = require("../../utils/tryCatch");

const getUsersInfo = tryCatch(async (req, res) => {
  const { email } = req.params; 
  console.log(email);

  const users = await connectDB("users");
  const userInfo = await users.findOne({ email });

  if (!userInfo) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(userInfo); 
});

module.exports = {
  getUsersInfo,
};
