const { connectDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const { tryCatch } = require('../utils/tryCatch');
const { model } = require('../config/geminiModel');

// Get Something
const getSomething = tryCatch(async (req, res) => {
  const collection = await connectDB('collection_name');

  res.send({ message: 'Get' });
});

// Generate Quiz
const generateQuiz = tryCatch(async (req, res) => {
  const { topic, difficulty } = req.query;

  // Return if Topic or Difficulty is missing
  if (!topic || !difficulty) {
    return res
      .status(400)
      .json({ error: 'Topic and difficulty are required.' });
  }

  // Prompt
  const prompt = `Generate a quiz question about ${topic} with a ${difficulty} difficulty level.`;

  const result = await model.generateContent(prompt);

  // Return if error occurred
  if (result.error) {
    return res.status(500).json(result);
  }

  const jsonQuiz = result.response.text().slice(7, -4);

  const quizData = await JSON.parse(jsonQuiz);

  res.send(quizData);
});

module.exports = {
  getSomething,
  generateQuiz,
};
