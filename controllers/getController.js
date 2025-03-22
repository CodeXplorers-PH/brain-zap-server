const { connectDB } = require('../config/database');
const { ObjectId } = require('mongodb');
const { tryCatch } = require('../utils/tryCatch');
const { model } = require('../config/geminiModel');

// Prompt generator
const generatePrompt = (topic, difficulty = 'medium') => {
  return `Generate a unique and different quiz question about ${topic} with a ${difficulty} difficulty level. Ensure each response is varied and not repetitive.`;
};

// Get Something
const getSomething = tryCatch(async (req, res) => {
  const collection = await connectDB('collection_name');

  res.send({ message: 'Get' });
});

// Generate Quiz
const generateQuiz = tryCatch(async (req, res) => {
  const { topic, difficulty } = req.query;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required!' }); // Return if Topic or Difficulty is missing
  }

  const prompt = generatePrompt(topic, difficulty); // Generate Prompt
  const result = await model.generateContent(prompt); // Gemini response

  if (result.error) {
    return res.status(500).json(result); // Return if error occurred
  }

  const jsonQuiz = result.response.text().slice(7, -4); // Remove (```json, ```)
  const quizData = await JSON.parse(jsonQuiz);

  res.send(quizData);
});

module.exports = {
  getSomething,
  generateQuiz,
};
