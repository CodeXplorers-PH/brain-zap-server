const { tryCatch } = require('../../utils/tryCatch');
const { quizModel } = require('../../config/geminiModel');

// Quizzes Number
const quizzesNumber = 10;

// Prompt generator
const generatePrompt = (topic, difficulty = 'easy') => {
  return `Generate unique and different ${quizzesNumber} quizzes questions about ${topic} with a ${difficulty} difficulty level.`;
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
  const result = await quizModel.generateContent(prompt); // Gemini response

  if (result.error) {
    return res.status(500).send(result.error); // Return if error occurred
  }

  const quizData = result.response.text().slice(7, -4); // Remove (```json, ```)
  const quiz = JSON.parse(quizData);

  res.send(quiz);
});

module.exports = {
  generateQuiz,
};
