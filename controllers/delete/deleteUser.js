const { ObjectId } = require("mongodb");
const { connectDB } = require("../../config/database");
const { tryCatch } = require("../../utils/tryCatch");

const deleteUser = tryCatch(async (req, res) => {
  const { id } = req.params;
  const usersCollection = await connectDB("users");

  const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 1) {
    res.status(200).json({ message: "User deleted successfully." });
  } else {
    res.status(404).json({ message: "User not found." });
  }
});

module.exports = {
  deleteUser,
};
