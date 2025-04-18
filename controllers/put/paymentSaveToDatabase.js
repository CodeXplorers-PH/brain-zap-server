const { connectDB } = require("../../config/database");
const { tryCatch } = require("../../utils/tryCatch");

const paymentSaveToDatabase = tryCatch(async (req, res) => {
    const paymentInfo = req.body;
  
    // Connect to the users collection
    const users = await connectDB("users");
  
    // Find the user with the provided email
    const specificUser = await users.findOne({ email: paymentInfo.email });
  
    if (!specificUser) {
      return res.status(404).json({ message: "User not found" });
    }
  
    // Update the user's data with the paymentInfo, including adding coupon to the array
    const updatedUser = await users.updateOne(
      { email: paymentInfo.email },  // Filter by email
      {
        $set: {
          subscription: paymentInfo.subscription,  // Update the subscription field
          PaymentDate: paymentInfo.PaymentDate,  // Update the PaymentDate
          subscriptionLastTime: paymentInfo.subscriptionLastTime,  // Update subscriptionLastTime
          transectionId: paymentInfo.transectionId,  // Update the transaction ID
        },
        $addToSet: {  // Add to array but avoid duplicates
          usedCoupon: paymentInfo.usedCoupon,  // Add coupon to the usedCoupon array if not already present
        },
      }
    );
  
    if (updatedUser.modifiedCount === 0) {
      return res.status(400).json({ message: "Failed to update user data" });
    }
  
    // Send success response
    res.status(200).json({ message: "Payment information saved and user updated successfully" });
  });
  
  

module.exports = {
  paymentSaveToDatabase,
};
