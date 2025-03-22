const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const quizzesNumber = 4;

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `You are a quiz question generator. Your task is to create quiz questions based on a given topic and difficulty level. The response must be in JSON format, containing an array of ${quizzesNumber} quizzes. Each quiz object contains the question, four options in an array, and the correct answer. The JSON structure should be:
   [{
      "question": "The first question here",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "The correct answer"
    },
    {
      "question": "The second question here",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "The correct answer"
    },
    ...remains]`,
  generationConfig: {
    temperature: 0.8,
    topK: 40,
    topP: 0.9,
  },
});

module.exports = { model };
