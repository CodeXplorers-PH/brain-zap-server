const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `You are a quiz question generator. Your task is to create quiz questions based on a given topic and difficulty level. The response must be in JSON format, containing the question, four options in an array, and the correct answer. The JSON structure should be:
    {
      "question": "The question here",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "The correct answer"
    }`,
  generationConfig: {
    temperature: 0.8,
    topK: 40,
    topP: 0.9,
  },
});

module.exports = { model };
