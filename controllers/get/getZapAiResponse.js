const { tryCatch } = require("../../utils/tryCatch");
const { zapAi } = require("../../config/geminiModel");

// ZapAI Response Handler
const getZapAiResponse = tryCatch(async (req, res) => {
  const { email } = req.params;
  const { message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required." });
  }

  // Create prompt for ZapAI
  const prompt = `
  A user with email "${email}" asked:
  "${message}"
  
  Respond to the message as ZapAI would.
  `;

  const result = await zapAi.generateContent(prompt);

  if (!result || !result.response.text) {
    return res
      .status(500)
      .json({ error: "Failed to generate ZapAI response." });
  }

  const aiReply = result?.response?.text();

  res.send({
    email,
    response: aiReply,
  });
});

module.exports = {
  getZapAiResponse,
};
