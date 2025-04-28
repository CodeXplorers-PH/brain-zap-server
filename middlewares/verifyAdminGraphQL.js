const { connectDB } = require("../config/database");

const verifyAdminGraphQL = async (req, res, next) => {
  try {
    const { email } = req.headers;

    if (!email) {
      return res.status(400).send({ message: "Email header is missing" });
    }

    const users = await connectDB("users");
    const userInfo = await users.findOne({ email });

    const isAdmin = userInfo?.role === "admin";
    if (!isAdmin) {
      return res.status(403).send({ message: "Forbidden Access" });
    }

    next();
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  verifyAdminGraphQL,
};
