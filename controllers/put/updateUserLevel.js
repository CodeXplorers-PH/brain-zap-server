const { connectDB } = require('../../config/database');
const { tryCatch } = require('../../utils/tryCatch');

const updateUserLevel = tryCatch(async (req, res) => {
  const collection = await connectDB('users');

  res.send({ message: 'hi' });
});

module.exports = { updateUserLevel };
