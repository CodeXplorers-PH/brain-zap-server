require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Controllers
const { getSomething, generateQuiz } = require('./controllers/getController');
const { postSomething } = require('./controllers/postController');
const { putSomething } = require('./controllers/putController');
const { deleteSomething } = require('./controllers/deleteController');

// Server
const app = express();
const port = process.env.PORT || 5000;

const corsOption = {
  origin: ['http://localhost:5173'],
  credentials: true,
};
// use middlewares
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// default route
app.get('/', (req, res) => {
  res.send('Hello');
});

// Routes
(async () => {
  try {
    // ** Get Starts **
    app.get('/get', getSomething);
    app.get('/generate_quiz', generateQuiz);
    // ** Get Ends **

    // ** Post Starts **
    app.post('/post', postSomething);
    // ** Post Ends **

    // ** Put/Patch Starts **
    app.put('/put', putSomething);
    // ** Put/Patch Ends **

    // ** Delete Starts **
    app.delete('/delete', deleteSomething);
    // ** Delete Ends **
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
})();

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
