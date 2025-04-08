const { tryCatch } = require('../../utils/tryCatch');
const { connectDB } = require('../../config/database');

const lockedUser = tryCatch(async (req, res) => {
  const user = req.body;

  if (!user?.email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const collection = await connectDB('lockedUsers');
  const existingUser = await collection.findOne({ email: user.email });

  if (existingUser) {
    const now = Date.now();

    if (existingUser.isLocked && existingUser.unlockTime <= now) {
      // Unlock the account
      await collection.updateOne(
        { email: user.email },
        { $set: { isLocked: false, unlockTime: null } }
      );
      return res.status(200).json({
        message: 'User account is unlocked.',
        isLocked: false,
      });
    }

    if (existingUser.isLocked && existingUser.unlockTime > now) {
      return res.status(200).json({
        message: 'User account is locked.',
        isLocked: true,
        unlockTime: existingUser.unlockTime,
      });
    }
  }

  // If no user found in lockedUsers
  return res.status(200).json({
    message: 'User account is not locked.',
    isLocked: false,
  });
});

module.exports = {
  lockedUser,
};
