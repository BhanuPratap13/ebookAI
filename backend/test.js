require("dotenv").config({
  override: true,
});
const { GoogleGenAI } = require("@google/genai");

console.log("Key:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: "Explain how AI works in a few words",
    });

    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}

main();