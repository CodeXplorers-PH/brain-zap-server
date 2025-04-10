require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// *** Controllers ***
// -- Get --
const { generateQuiz } = require("./controllers/get/getQuizzes");
// -- Post --
const { generatedFeedback } = require("./controllers/post/generateFeedback");
const { postUser } = require("./controllers/post/postUser");
// -- Put --
const { putSomething } = require("./controllers/put/putController");
// -- Delete --
const { deleteSomething } = require("./controllers/delete/deleteController");
// Controllers
const { postLockedUser } = require("./controllers/post/postLockedUser");
const { lockedUser } = require("./controllers/get/getLockedUser");
const { postPayment } = require("./controllers/post/postPayment");
const {
  paymentSaveToDatabase,
} = require("./controllers/put/paymentSaveToDatabase");
const { getUsersInfo } = require("./controllers/get/getUserInfo");

// Server
const app = express();
const port = process.env.PORT || 5000;

const corsOption = {
  origin: ["http://localhost:5173", "https://brain-zap-99226.web.app"],
  credentials: true,
};
// use middlewares
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// default route
app.get("/", (req, res) => {
  res.send("Hello");
});

// Routes
(async () => {
  try {
    // ** Get Starts **
    app.get("/generate_quiz", generateQuiz);
    app.get("/userInfo/:email", getUsersInfo);
    // ** Get Ends **

    // ** Post Starts **
    app.post("/post_user", postUser);
    app.post("/quiz_feedback", generatedFeedback);
    app.post("/account_lockout", postLockedUser);
    app.post("/create-payment-intent", postPayment);

    // ** Post Ends **

    // ** Put/Patch Starts **
    app.put("/put", putSomething);
    app.patch("/account_lockout", lockedUser);
    app.patch("/payment", paymentSaveToDatabase);
    // ** Put/Patch Ends **

    // ** Delete Starts **
    app.delete("/delete", deleteSomething);
    // ** Delete Ends **
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
