const { quizModel } = require('../../config/geminiModel');
const { tryCatch } = require('../../utils/tryCatch');

// Quizzes Number
const quizzesNumber = 10;

// Prompt generator
const generatePromptMc = (topic, difficulty = 'easy', quizzesNumber = 10) => {
  return `Generate unique and different ${quizzesNumber} quizzes questions about ${topic} with a ${difficulty} difficulty level.`;
};

// Get Something
const getSomething = tryCatch(async (req, res) => {
  const collection = await connectDB('collection_name');
  res.send({ message: 'Get' });
});

const generatePromptTf = (topic, difficulty = "easy", quizzesNumber = 10) => {
const generatePromptTf = (topic, difficulty = 'easy', quizzesNumber = 10) => {
  return `Generate ${quizzesNumber} unique true/false quiz questions about "${topic}" with a "${difficulty}" difficulty level. Each question should have only two options: True or False.`;
};
}

// Generate Quiz
const generateQuiz = async ({ topic, difficulty, quizzesNumber, type }) => {
  if (!topic) {
    throw new Error('Topic is required!'); // Return if Topic or Difficulty is missing
  }

  const prompt =
    type === 'mc'
      ? generatePromptMc(topic, difficulty, quizzesNumber)
      : generatePromptTf(topic, difficulty, quizzesNumber); // Generate Prompt
  const result = await quizModel.generateContent(prompt); // Gemini response

  if (result.error) {
    throw new Error(result.error); // Return if error occurred
  }

  const quizData = result.response.text().slice(7, -4); // Remove (```json, ```)
  const quiz = JSON.parse(quizData);

  return quiz || [];
};

module.exports = {
  generateQuiz,
};
