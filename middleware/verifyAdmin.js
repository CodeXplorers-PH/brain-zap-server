const { ObjectId } = require("mongodb");
const { connectDB } = require("../../config/database");
const { tryCatch } = require("../../utils/tryCatch");

const verifyAdmin = tryCatch(async (req, res, next) => {
  const { email } = req.params;

  const users = await connectDB("users");
  const userInfo = await users.findOne({ email });

  const isAdmin = userInfo?.role === "admin";
  if (!isAdmin) {
    return res.status(403).send({ message: "Forbidden Access" });
  }
  next();
});

module.exports = {
  verifyAdmin,
};

module.exports = {
  verifyAdmin,
};
