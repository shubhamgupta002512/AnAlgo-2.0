const { getChatReply } = require('../utils/groq');

const SYSTEM_PROMPT =
  'You are the AnAlgo Assistant, a friendly coding-interview prep tutor. ' +
  'Help users understand data structures & algorithms concepts, explain time/space complexity, ' +
  'and give hints for problems without immediately revealing full solutions unless explicitly asked. ' +
  'Keep answers concise, clear, and beginner-friendly. Use short code snippets only when necessary.';

// @desc   Chat with the AI assistant
// @route  POST /api/chatbot
const chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          'Chatbot is not configured yet. Get a free API key at https://console.groq.com/keys and set GROQ_API_KEY in backend/.env',
      });
    }

    const trimmedHistory = Array.isArray(history) ? history.slice(-10) : [];

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...trimmedHistory
        .filter((h) => h && h.role && h.content)
        .map((h) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content })),
      { role: 'user', content: message },
    ];

    const reply = await getChatReply(messages);
    res.json({ success: true, data: { reply } });
  } catch (err) {
    if (err.response) {
      console.error('Groq API Error:', err.response.status, err.response.data);
      return res.status(502).json({ 
        success: false, 
        message: 'Chatbot service error. Please try again.',
        error: err.response.data?.error?.message || 'Unknown error'
      });
    }
    console.error('Chatbot error:', err.message);
    next(err);
  }
};

module.exports = { chat };
