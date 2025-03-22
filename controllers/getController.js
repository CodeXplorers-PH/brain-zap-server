const { connectDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const { tryCatch } = require('../utils/tryCatch');

// Get Something
const getSomething = tryCatch(async (req, res) => {
  const collection = await connectDB('collection_name');

  res.send({ message: 'Get' });
});

// Generate Quiz
const generateQuiz = tryCatch(async (req, res) => {
  const { topic, difficulty } = req.params;

  res.send({ message: 'Hi! I am gemini.' });
});

module.exports = {
  getSomething,
  generateQuiz,
};
