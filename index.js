require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const root = require("./graphql/root");

// ** Jwt **
const { postJwtToken } = require("./jwt/postJwtToken");

// *** Middlewares ***
const { verifyToken } = require("./middlewares/verifyToken");
const { verifyAdmin } = require("./middlewares/verifyAdmin");

// *** Controllers ***
// -- Get --
const { getBlogs, getBlogById } = require("./controllers/get/getBlogs");
const { getQuizHistory } = require("./controllers/get/getQuizHistory");
const { getZapAiResponse } = require("./controllers/get/getZapAiResponse");
const { getUsersInfo } = require("./controllers/get/getUserInfo");
const { getAdmin } = require("./controllers/get/getAdmin");
const { getAllUsers } = require("./controllers/get/getAllUsers");
const { getAdminDashboard } = require("./controllers/get/getAdminDashboard");

// -- Post --
const { generatedFeedback } = require("./controllers/post/generateFeedback");
const { postUser } = require("./controllers/post/postUser");
const { postBlog } = require("./controllers/post/postBlog");
const { postQuizHistory } = require("./controllers/post/postQuizHistory");
const { postLockedUser } = require("./controllers/post/postLockedUser");
const { postPayment } = require("./controllers/post/postPayment");
const {
  postLockUserByAdmin,
} = require("./controllers/post/postLockUserByAdmin");

// -- Put/Patch --
const { updateUserLevel } = require("./controllers/put/updateUserLevel");
const { likeBlog, updateBlog } = require("./controllers/put/putBlog");
const { patchLockedUser } = require("./controllers/put/patchLockedUser");
const {
  paymentSaveToDatabase,
} = require("./controllers/put/paymentSaveToDatabase");
const { patchMakeUserAdmin } = require("./controllers/put/patchMakeUserAdmin");

// -- Delete --
const { deleteBlog } = require("./controllers/delete/deleteBlog");
const { deleteUser } = require("./controllers/delete/deleteUser");
const { verifyAdminGraphQL } = require("./middlewares/verifyAdminGraphQL");
const { getAllFeedback } = require("./controllers/get/getAllFeedback");
const { patchFeedbackRead } = require("./controllers/post/patchFeedbackRead");
const {
  deleteFeedbackMessage,
} = require("./controllers/delete/deleteFeedbackMessage");
const {
  getAllUsersAdminPanel,
} = require("./controllers/get/getAllUsersAdminPanel");

// Server
const app = express();
const port = process.env.PORT || 5000;

// Check MongoDB connection string
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI environment variable is not set");
  process.exit(1);
}

// More permissive CORS to help with development
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://brain-zap-99226.web.app",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "email"],
};

// Use middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" })); // Increased limit for image uploads
app.use(cookieParser());
app.use(morgan("dev"));

// Add middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Default route
app.get("/", (req, res) => {
  res.send("BrainZap API is running");
});

// Routes
(async () => {
  try {
    // ** Jwt **
    app.post("/jwt", postJwtToken);

    // ** Get Starts **
    app.get("/generate_quiz", generateQuiz);
    app.get("/userInfo/:email", getUsersInfo); //Profile
    app.get("/quiz_history/:email", getQuizHistory);
    app.get("/blogs", getBlogs);
    app.get("/blogs/:id", getBlogById);
    app.get("/user/admin/:email", getAdmin);
    app.get("/api/users/:email", verifyAdmin, getAllUsers); //Admin Home
    app.get("/adminDashboard/:email", verifyAdmin, getAdminDashboard); //All Users
    app.get("/users", getAllUsers); //Leaderboard
    app.get("/feedbackMessages", verifyAdminGraphQL, getAllFeedback); //Get All Feedback Message For Admin Panel
    app.get("/allUsers/information", verifyAdminGraphQL, getAllUsersAdminPanel); // Get All Users for Admin Panel
    // ** Get Ends **

    // ** Post Starts **
    app.post("/post_user", postUser);
    app.post("/quiz_feedback", generatedFeedback);
    app.post("/account_lockout", postLockedUser);
    app.post("/create-payment-intent", postPayment);
    app.post("/quiz_history", postQuizHistory);
    app.post("/blogs", postBlog);
    app.post("/zapAi/:email", getZapAiResponse);
    app.post("/lockoutUser/:id", verifyAdminGraphQL, postLockUserByAdmin); // Lock User By Admin
    // ** Post Ends **

    // ** Put/Patch Starts **
    app.patch("/account_lockout", patchLockedUser);
    app.put("/update_user_level", updateUserLevel);
    app.patch("/payment", paymentSaveToDatabase);
    app.put("/blogs/:id", updateBlog);
    app.put("/blogs/:id/like", likeBlog);
    app.patch("/makeAdmin/:id/:email", verifyAdmin, patchMakeUserAdmin);
    app.patch("/feedbackRead/:id", verifyAdminGraphQL, patchFeedbackRead);
    // ** Put/Patch Ends **

    // ** Delete Starts **
    app.delete("/blogs/:id", deleteBlog);
    app.delete("/deleteUser/:id", verifyAdminGraphQL, deleteUser); // Delete User By Admin
    app.delete(
      "/feedbackDelete/:id",
      verifyAdminGraphQL,
      deleteFeedbackMessage
    ); // Delete Feedback By Admin
    // ** Delete Ends **
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred",
  });
});

// GraphQL API's
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// Admin Dashboard
app.use(
  "/adminDashboard",
  verifyToken,
  verifyAdminGraphQL,
  graphqlHTTP((req) => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: { email: req.headers["email"] },
  }))
);

// Feedback Messages
app.use(
  "/feedbackMessages",
  verifyAdminGraphQL,
  graphqlHTTP((req) => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: { email: req.headers["email"] },
  }))
);

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
