const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  const { code, language } = req.body;

  if (!code) return res.status(400).json({ message: "Code is required." });
  if (!language) return res.status(400).json({ message: "Language selection is required." });

  try {
    const response = await aiService(code, language);
    res.send(response);
  } catch (error) {
    console.error("❌ Error:", error?.message || error);
    res.status(500).json({ message: "Server error or API quota exceeded." });
  }
};
