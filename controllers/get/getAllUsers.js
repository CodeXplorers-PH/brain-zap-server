const { ObjectId } = require("mongodb");
const { connectDB } = require("../../config/database");
const { tryCatch } = require("../../utils/tryCatch");


const getAllUsers = tryCatch(async (req, res) => {
  const usersCollection = await connectDB("users");
  const users = await usersCollection.find().toArray();
  res.status(200).json(users);
});

module.exports = {
    getAllUsers,
};
