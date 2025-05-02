const { connectDB } = require('../../config/database');
const { tryCatch } = require('../../utils/tryCatch');

const getUsersInfo = tryCatch(async (req, res) => {
  const { email } = req.headers;

  const users = await connectDB('users');
  const userInfo = await users.findOne({ email });

  if (!userInfo) {
    return res.json({ success: false, message: 'User not found' });
  }

  res.status(200).json({ userInfo });
});

module.exports = {
  getUsersInfo,
};
