require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// *** Controllers ***
// -- Get --
const { generateQuiz } = require('./controllers/get/getQuizzes');
const { getBlogs, getBlogById } = require('./controllers/get/getBlogs');
// -- Post --
const { generatedFeedback } = require('./controllers/post/generateFeedback');
const { postUser } = require('./controllers/post/postUser');
const { postBlog } = require('./controllers/post/postBlog');
// -- Put --
const { putSomething } = require('./controllers/put/putController');
const { likeBlog, updateBlog } = require('./controllers/put/putBlog');
// -- Delete --
const { deleteSomething } = require('./controllers/delete/deleteController');
const { deleteBlog } = require('./controllers/delete/deleteBlog');
// Controllers
const { postLockedUser } = require('./controllers/post/postLockedUser');
const { postPayment } = require('./controllers/post/postPayment');
const {
  paymentSaveToDatabase,
} = require('./controllers/put/paymentSaveToDatabase');
const { getUsersInfo } = require('./controllers/get/getUserInfo');
const { patchLockedUser } = require('./controllers/put/patchLockedUser');
const { postQuizHistory } = require('./controllers/post/postQuizHistory');
const { getQuizHistory } = require('./controllers/get/getQuizHistory');

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
  origin: ['http://localhost:5173', 'https://brain-zap-99226.web.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
    // ** Get Starts **
    app.get('/generate_quiz', generateQuiz);
    app.get('/userInfo/:email', getUsersInfo);
    app.get('/quiz_history/:email', getQuizHistory);
    app.get('/blogs', getBlogs);
    app.get('/blogs/:id', getBlogById);
    // ** Get Ends **

    // ** Post Starts **
    app.post('/post_user', postUser);
    app.post('/quiz_feedback', generatedFeedback);
    app.post('/account_lockout', postLockedUser);
    app.post('/create-payment-intent', postPayment);
    app.post('/quiz_history', postQuizHistory);
    app.post('/blogs', postBlog);
    // ** Post Ends **

    // ** Put/Patch Starts **
    app.put('/put', putSomething);
    app.patch('/account_lockout', patchLockedUser);
    app.patch('/payment', paymentSaveToDatabase);
    app.put('/blogs/:id', updateBlog);
    app.put('/blogs/:id/like', likeBlog);
    // ** Put/Patch Ends **

    // ** Delete Starts **
    app.delete('/delete', deleteSomething);
    app.delete('/blogs/:id', deleteBlog);
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
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});