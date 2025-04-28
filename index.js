require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const root = require('./graphql/root');

// *** Middlewares ***
const { verifyAdmin } = require('./middlewares/verifyAdmin');

// *** Controllers ***
// -- Get --

const { generateQuiz } = require('./controllers/get/getQuizzes');
const { getBlogs, getBlogById } = require('./controllers/get/getBlogs');
const { getQuizHistory } = require('./controllers/get/getQuizHistory');
const { getZapAiResponse } = require('./controllers/get/getZapAiResponse');
const { getUsersInfo } = require('./controllers/get/getUserInfo');
const { getAdmin } = require('./controllers/get/getAdmin');
const { getAllUsers } = require('./controllers/get/getAllUsers');
const { getAdminDashboard } = require('./controllers/get/getAdminDashboard');

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
const { likeBlog, updateBlog } = require('./controllers/put/putBlog');
const { patchLockedUser } = require('./controllers/put/patchLockedUser');
const {
  paymentSaveToDatabase,
} = require('./controllers/put/paymentSaveToDatabase');
const { patchMakeUserAdmin } = require('./controllers/put/patchMakeUserAdmin');

// -- Delete --
const { deleteBlog } = require('./controllers/delete/deleteBlog');
const { deleteUser } = require('./controllers/delete/deleteUser');

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

// Generate Quiz using GraphQL
app.use(
  '/generate_quiz',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// Routes
(async () => {
  try {
    // ** Get Starts **
    // app.get('/generate_quiz', generateQuiz);
    app.get('/userInfo/:email', getUsersInfo);
    app.get('/quiz_history/:email', getQuizHistory);
    app.get('/blogs', getBlogs);
    app.get('/blogs/:id', getBlogById);
    app.get('/user/admin/:email', getAdmin);
    app.get('/api/users/:email', verifyAdmin, getAllUsers);
    app.get('/adminDashboard/:email', verifyAdmin, getAdminDashboard);
    app.get('/users', getAllUsers);
    // ** Get Ends **

    // ** Post Starts **
    app.post('/post_user', postUser);
    app.post('/quiz_feedback', generatedFeedback);
    app.post('/account_lockout', postLockedUser);
    app.post('/create-payment-intent', postPayment);
    app.post('/quiz_history', postQuizHistory);
    app.post('/blogs', postBlog);
    app.post('/zapAi/:email', getZapAiResponse);
    app.post('/lockoutUser/:id/:email', verifyAdmin, postLockUserByAdmin);
    // ** Post Ends **

    // ** Put/Patch Starts **
    app.patch('/account_lockout', patchLockedUser);
    app.put('/update_user_level', updateUserLevel);
    app.patch('/payment', paymentSaveToDatabase);
    app.put('/blogs/:id', updateBlog);
    app.put('/blogs/:id/like', likeBlog);
    app.patch('/makeAdmin/:id/:email', verifyAdmin, patchMakeUserAdmin);
    // ** Put/Patch Ends **

    // ** Delete Starts **
    app.delete('/blogs/:id', deleteBlog);
    app.delete('/deleteUser/:id/:email', verifyAdmin, deleteUser);
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

// Blog
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});