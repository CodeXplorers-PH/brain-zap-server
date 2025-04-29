const { tryCatch } = require("../../utils/tryCatch");
const { connectDB } = require("../../config/database");
const { ObjectId } = require("mongodb");

const patchFeedbackRead = tryCatch(async (req, res) => {
  const { id } = req.params;

  const feedbackCollection = await connectDB("feedback");

  const updatedFeedback = await feedbackCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { read: "Done" } },
    { returnDocument: "after" }
  );

  res.status(200).json({ success: true });
});

module.exports = { patchFeedbackRead };
