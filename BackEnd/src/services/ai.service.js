const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `You are an AI code reviewer with 7+ years experience. You analyze and review code, focusing on quality, performance, and security. Provide constructive feedback and suggest better practices.`
});

async function generateContent(code, language) {
  const prompt = `Language: ${language}\n\nCode:\n${code}`;

  const result = await model.generateContent(prompt);

  const output = result.response.text();
  console.log("✅ Gemini Response:", output?.slice(0, 100), "...");

  return output;
}

module.exports = generateContent;
