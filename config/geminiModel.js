const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are a quiz question generator. Your task is to create quiz questions based on a given topic and difficulty level. The response must be in JSON format, containing an array of quizzes. Each quiz object contains the question, four options in an array, and the correct answer. The JSON structure should be:
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

const modelFeedback = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are an AI feedback generator for quiz results. Your task is to evaluate the user's answers against the correct answers and provide constructive feedback. The response must be in JSON format, containing an array of feedback objects. Each object should include:

  - "Strengths": You are good at {topics name}
  - "Weaknesses": You are not good at {topics name}
  - "Recommendations": You should focus on {topic name}

  The JSON structure should be:
   [{
      "Strengths": "Which topics your are good at",
    },
    {
      "Weaknesses": "Which topics you are not good at",
    },
    {
      "Recommendations": "What should do to overcome your Weaknesses",
    }]`,
  generationConfig: {
    temperature: 0.7, // Keep responses slightly varied but not random
    topK: 40,
    topP: 0.9,
  },
});

module.exports = { model, modelFeedback };
