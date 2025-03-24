const { tryCatch } = require("../utils/tryCatch");
const { modelFeedback } = require("../config/geminiModel");

// Generate Feedback Prompt
const generateFeedbackPrompt = (quizData, userAnswers) => {
  return `Evaluate the following quiz responses and provide feedback on where the user should improve or learn. Identify weak areas and suggest topics for further study. 

  Quiz Questions and Answers:
  ${JSON.stringify(quizData)}

  User's Responses:
  ${JSON.stringify(userAnswers)}

  Provide a structured feedback summary highlighting the user's strengths and areas for improvement.`;
};

// Generate Quiz Feedback
const generatedFeedback = tryCatch(async (req, res) => {
  const { quizData, userAnswers } = req.body; // Expect both questions and answers

  if (!quizData || !userAnswers || !Array.isArray(quizData)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing quiz data/user answers." });
  }

  const prompt = generateFeedbackPrompt(quizData, userAnswers); // Generate AI prompt
  const result = await modelFeedback.generateContent(prompt); // Get AI response

  if (!result || !result.response.text) {
    return res.status(500).json({ error: "Failed to generate AI feedback." });
  }

  const feedback = result.response.text().slice(7, -4); // Remove (```json, ```)
  const feedbackFromAi = JSON.parse(feedback);

  res.send(feedbackFromAi); // Send AI-generated feedback
});

module.exports = {
  generatedFeedback,
};
