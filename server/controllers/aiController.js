import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Categorize issue automatically
// @route   POST /api/ai/categorize
// @access  Private
export const categorizeIssue = async (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for a civic issue reporting platform. 
          Analyze the following description and provide exactly a JSON response with three fields:
          "category" (one of: Pothole, Garbage, Streetlight, Water, Traffic, Construction, Noise, Other),
          "priority" (one of: low, medium, high, critical),
          "suggestion" (a 1-2 sentence short resolution suggestion for admin).`
        },
        { role: 'user', content: description }
      ],
      response_format: { type: "json_object" }
    });

    const aiAnalysis = JSON.parse(response.choices[0].message.content);
    res.json(aiAnalysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    AI Chatbot
// @route   POST /api/ai/chat
// @access  Private
export const chatWithAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const formattedHistory = history ? history.map(h => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.text
    })) : [];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant for CivicSense, a civic issue reporting platform in Vadodara, Gujarat. You help citizens understand how to report issues, track status, and learn about local civic responsibilities.'
        },
        ...formattedHistory,
        { role: 'user', content: message }
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
