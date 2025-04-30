require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const root = require('./graphql/root');

// ** Jwt **
const { postJwtToken } = require('./jwt/postJwtToken');

// *** Middlewares ***
const { verifyToken } = require('./middlewares/verifyToken');
const { verifyAdmin } = require('./middlewares/verifyAdmin');

// *** Controllers ***
// -- Get --
const { getBlogs, getBlogById } = require('./controllers/get/getBlogs');
const { getQuizHistory } = require('./controllers/get/getQuizHistory');
const { getZapAiResponse } = require('./controllers/get/getZapAiResponse');
const { getUsersInfo } = require('./controllers/get/getUserInfo');
const { getAdmin } = require('./controllers/get/getAdmin');
const { getAllUsers } = require('./controllers/get/getAllUsers');

// -- Post --
const { generatedFeedback } = require('./controllers/post/generateFeedback');
const { postUser } = require('./controllers/post/postUser');
const { postBlog } = require('./controllers/post/postBlog');
const { postQuizHistory } = require('./controllers/post/postQuizHistory');
const { postLockedUser } = require('./controllers/post/postLockedUser');
const { postPayment } = require('./controllers/post/postPayment');
const {
  postLockUserByAdmin,
} = require('./controllers/post/postLockUserByAdmin');

// -- Put/Patch --
const { updateUserLevel } = require('./controllers/put/updateUserLevel');
const { updateBlog, likeBlog } = require('./controllers/put/putBlog');
const { patchLockedUser } = require('./controllers/put/patchLockedUser');
const {
  paymentSaveToDatabase,
} = require('./controllers/put/paymentSaveToDatabase');
const { patchMakeUserAdmin } = require('./controllers/put/patchMakeUserAdmin');

// -- Delete --
const { deleteBlog } = require('./controllers/delete/deleteBlog');
const { deleteUser } = require('./controllers/delete/deleteUser');
const { verifyAdminGraphQL } = require('./middlewares/verifyAdminGraphQL');
const { patchFeedbackRead } = require('./controllers/post/patchFeedbackRead');
const {
  deleteFeedbackMessage,
} = require('./controllers/delete/deleteFeedbackMessage');
const {
  getAllUsersAdminPanel,
} = require('./controllers/get/getAllUsersAdminPanel');

// Server
const app = express();
const port = process.env.PORT || 5000;

// Check MongoDB connection string
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI environment variable is not set');
  process.exit(1);
}

// More permissive CORS to help with development
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://brain-zap-99226.web.app',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'email'],
};

// Use middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(cookieParser());
app.use(morgan('dev'));

// Add middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Default route
app.get('/', (req, res) => {
  res.send('BrainZap API is running');
});

// Routes
(async () => {
  try {
    // ** Jwt **
    app.post('/jwt', postJwtToken);

    // ** Get Starts **
    app.get('/userInfo', verifyToken, getUsersInfo); //Profile
    app.get('/quiz_history', verifyToken, getQuizHistory);
    app.get('/blogs', verifyToken, getBlogs);
    app.get('/blogs/:id', verifyToken, getBlogById);
    app.get('/user/admin', verifyToken, getAdmin);
    app.get('/users', verifyToken, getAllUsers); //Leaderboard
    app.get(
      '/allUsers/information',
      verifyToken,
      verifyAdminGraphQL,
      getAllUsersAdminPanel
    ); // Get All Users for Admin Panel
    // ** Get Ends **

    // ** Post Starts **
    app.post('/post_user', postUser);
    app.post('/quiz_feedback', verifyToken, generatedFeedback);
    app.post('/account_lockout', postLockedUser);
    app.post('/create-payment-intent', postPayment);
    app.post('/quiz_history', verifyToken, postQuizHistory);
    app.post('/blogs', verifyToken, postBlog);
    app.post('/zapAi', verifyToken, getZapAiResponse);
    app.post(
      '/lockoutUser/:id',
      verifyToken,
      verifyAdminGraphQL,
      postLockUserByAdmin
    ); // Lock User By Admin
    // ** Post Ends **

    // ** Put/Patch Starts **
    app.patch('/account_lockout', patchLockedUser);
    app.put('/update_user_level', verifyToken, updateUserLevel);
    app.patch('/payment', verifyToken, paymentSaveToDatabase);
    app.put('/blogs/:id', verifyToken, updateBlog);
    app.patch('/makeAdmin/:id', verifyToken, verifyAdmin, patchMakeUserAdmin);
    app.patch(
      '/feedbackRead/:id',
      verifyToken,
      verifyAdminGraphQL,
      patchFeedbackRead
    );
    app.put('/blogs/:id/like', likeBlog);
    // ** Put/Patch Ends **

    // ** Delete Starts **
    app.delete('/blogs/:id', verifyToken, deleteBlog);
    app.delete('/deleteUser/:id', verifyToken, verifyAdminGraphQL, deleteUser); // Delete User By Admin
    app.delete(
      '/feedbackDelete/:id',
      verifyToken,
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
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected error occurred',
  });
});

// *** GraphQL API's ***
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// Generate Quiz
app.use(
  '/secure_graphql',
  verifyToken,
  graphqlHTTP(req => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: { email: req.headers['email'] },
  }))
);

// Admin Dashboard
app.use(
  '/adminDashboard',
  verifyToken,
  verifyAdminGraphQL,
  graphqlHTTP(req => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: { email: req.headers['email'] },
  }))
);

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});