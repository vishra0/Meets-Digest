const OpenAI = require('openai').default;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});


async function summarizeText(text) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Summarize this: ${text}` }],
    });
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI Error:", error);
    return "Error summarizing text.";
  }
}

module.exports = { summarizeText };
