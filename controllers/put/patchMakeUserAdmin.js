const { ObjectId } = require("mongodb");
const { connectDB } = require("../../config/database");
const { tryCatch } = require("../../utils/tryCatch");

const patchMakeUserAdmin = tryCatch(async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  const usersCollection = await connectDB("users");

  const existingUser = await usersCollection.findOne({ _id: new ObjectId(id) });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found." });
  }

  await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role: "admin" } }
  );

  return res.status(200).json({ message: "User has been promoted to admin." });
});

module.exports = {
  patchMakeUserAdmin,
};
