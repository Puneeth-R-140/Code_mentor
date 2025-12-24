require('dotenv').config();
const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const analyzeCodeWithAI = async (code) => {
    const prompt = `You are an expert C++ coding mentor. Analyze the following C++ code snippet for logic errors, bugs, memory issues, and potential improvements.

Code Snippet:
\`\`\`cpp
${code}
\`\`\`

Return the response strictly in the following JSON format (no markdown, no extra text):
{
  "logicError": {
    "message": "Brief description of the logic error or null if correct.",
    "line": <line number of error or 0>,
    "confidence": <number between 0 and 1>
  },
  "hints": [
    { "type": "Nudge", "content": "A subtle hint pointing in the right direction." },
    { "type": "Clue", "content": "A more specific clue about what's wrong." },
    { "type": "Strategy", "content": "A clear strategy or fix for the issue." }
  ],
  "testCases": [
    { "input": "Example input 1", "pass": <boolean> },
    { "input": "Example input 2", "pass": <boolean> }
  ]
}

Pay special attention to: memory leaks, pointer errors, buffer overflows, uninitialized variables, undefined behavior, and RAII violations.
If the code is correct, set logicError to null and provide a "Nudge" hint suggesting a best practice or optimization.`;

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful coding mentor. Always respond with valid JSON only, no markdown formatting."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1024,
    });

    const responseText = completion.choices[0].message.content.trim();
    // Clean up markdown code blocks if present
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanedText);
};

// Fallback heuristic analyzer for C++
function analyzeWithHeuristics(code) {
    // Check for division by zero
    if (code.includes('/ 0') || code.includes('/0')) {
        return {
            logicError: {
                message: "Critical: Division by zero detected.",
                line: code.split('\n').findIndex(line => line.includes('/ 0') || line.includes('/0')) + 1,
                confidence: 0.99
            },
            hints: [
                { type: "Nudge", content: "Check your division operations." },
                { type: "Clue", content: "Division by zero causes undefined behavior in C++." },
                { type: "Strategy", content: "Add a check to ensure the divisor is non-zero before dividing." }
            ],
            testCases: [
                { input: "x = 10, y = 0", pass: false },
                { input: "x = 10, y = 2", pass: true }
            ]
        };
    }

    // Check for potential memory leak (new without delete)
    const hasNew = code.includes('new ');
    const hasDelete = code.includes('delete');
    if (hasNew && !hasDelete) {
        return {
            logicError: {
                message: "Warning: Potential memory leak - 'new' without corresponding 'delete'.",
                line: code.split('\n').findIndex(line => line.includes('new ')) + 1,
                confidence: 0.85
            },
            hints: [
                { type: "Nudge", content: "What happens to dynamically allocated memory?" },
                { type: "Clue", content: "Every 'new' should have a corresponding 'delete'." },
                { type: "Strategy", content: "Consider using smart pointers (unique_ptr, shared_ptr) or add 'delete' to free the memory." }
            ],
            testCases: [
                { input: "Allocate 100 objects", pass: false },
                { input: "Allocate and deallocate", pass: true }
            ]
        };
    }

    // Check for null pointer dereference
    if (code.match(/\*\s*\w+\s*;/) && !code.includes('nullptr') && !code.includes('NULL')) {
        const lines = code.split('\n');
        const ptrLine = lines.findIndex(line => line.match(/\*\s*\w+\s*;/));
        return {
            logicError: {
                message: "Warning: Pointer may be uninitialized before use.",
                line: ptrLine + 1,
                confidence: 0.75
            },
            hints: [
                { type: "Nudge", content: "What is the initial value of your pointer?" },
                { type: "Clue", content: "Uninitialized pointers contain garbage values." },
                { type: "Strategy", content: "Initialize pointers to nullptr or a valid address." }
            ],
            testCases: []
        };
    }

    // Check for missing semicolons
    const lines = code.split('\n');
    const missingSemicolon = lines.findIndex(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 &&
            !trimmed.startsWith('//') &&
            !trimmed.startsWith('#') &&
            !trimmed.endsWith(';') &&
            !trimmed.endsWith('{') &&
            !trimmed.endsWith('}') &&
            (trimmed.includes('int ') || trimmed.includes('return ') ||
                trimmed.includes('cout') || trimmed.includes('cin'));
    });

    if (missingSemicolon !== -1) {
        return {
            logicError: {
                message: "Syntax Error: Missing semicolon at the end of the statement.",
                line: missingSemicolon + 1,
                confidence: 0.95
            },
            hints: [
                { type: "Nudge", content: "C++ statements need proper termination." },
                { type: "Clue", content: "Check the end of your statement." },
                { type: "Strategy", content: `Add a ';' at the end of line ${missingSemicolon + 1}.` }
            ],
            testCases: []
        };
    }

    return {
        logicError: null,
        hints: [
            { type: "Nudge", content: "Consider edge cases and memory management." },
            { type: "Clue", content: "Test your function with boundary values." },
            { type: "Strategy", content: "Use RAII principles and smart pointers for safer code." }
        ],
        testCases: [
            { input: "Valid input", pass: true },
            { input: "Edge case", pass: true }
        ]
    };
}

router.post('/', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code snippet is required' });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn("No Groq API Key. Using heuristics.");
        return res.json(analyzeWithHeuristics(code));
    }

    try {
        const analysis = await analyzeCodeWithAI(code);
        res.json(analysis);
    } catch (error) {
        console.error('Groq API error, using heuristics:', error.message);
        return res.json(analyzeWithHeuristics(code));
    }
});

module.exports = router;
