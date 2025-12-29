const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

router.post('/', async (req, res) => {
    const { code, message, history = [] } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Build conversation history
        const messages = [
            {
                role: 'system',
                content: `You are an expert C++ programming assistant. The user is working on the following code:

\`\`\`cpp
${code}
\`\`\`

Answer their questions about this code. Be concise, helpful, and provide code examples when relevant. Format code blocks with proper markdown.`
            },
            ...history.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            {
                role: 'user',
                content: message
            }
        ];

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.7,
            max_tokens: 1024
        });

        const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

        res.json({ reply });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Failed to get AI response',
            details: error.message
        });
    }
});

module.exports = router;
