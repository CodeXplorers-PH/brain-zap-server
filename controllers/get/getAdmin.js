const { connectDB } = require('../../config/database');
const { tryCatch } = require('../../utils/tryCatch');

const getAdmin = tryCatch(async (req, res) => {
  const { email } = req.headers;

  const users = await connectDB('users');
  const userInfo = await users.findOne({ email });

  let admin = false;
  if (userInfo) {
    admin = userInfo?.role === 'admin';
  }
  res.send({ admin });
});

module.exports = {
  getAdmin,
};
