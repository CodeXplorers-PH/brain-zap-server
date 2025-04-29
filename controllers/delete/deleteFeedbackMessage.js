const { tryCatch } = require("../../utils/tryCatch");
const { connectDB } = require("../../config/database");
const { ObjectId } = require("mongodb");

const deleteFeedbackMessage = tryCatch(async (req, res) => {
  const { id } = req.params;

  const feedbackCollection = await connectDB("feedback");

  const result = await feedbackCollection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 1) {
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "Feedback not found." });
  }
});

module.exports = { deleteFeedbackMessage };
