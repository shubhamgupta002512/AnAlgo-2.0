const axios = require('axios');

// Groq offers a free-tier, OpenAI-compatible chat completions API with
// generous limits. Get a free key at https://console.groq.com/keys
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'groq/compound-mini';

const getChatReply = async (messages) => {
  const { data } = await axios.post(
    GROQ_API_URL,
    {
      model: GROQ_MODEL,
      messages,
      temperature: 0.5,
      max_tokens: 600,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    }
  );

  return data.choices[0].message.content;
};

module.exports = { getChatReply };
