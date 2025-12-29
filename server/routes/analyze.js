require('dotenv').config();
const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const analyzeCodeWithAI = async (code) => {
    const prompt = `You are an expert C++ coding mentor. Analyze the following C++ code snippet for logic errors, bugs, memory issues, complexity, and potential improvements.

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
  ],
  "complexity": {
    "timeComplexity": "Big O notation (e.g., O(n), O(n²), O(log n))",
    "timeExplanation": "Brief explanation of time complexity",
    "spaceComplexity": "Big O notation",
    "spaceExplanation": "Brief explanation of space complexity",
    "qualityScore": <number 1-10>,
    "suggestions": ["Optimization suggestion 1", "Optimization suggestion 2"]
  }
}

Pay special attention to: memory leaks, pointer errors, buffer overflows, uninitialized variables, undefined behavior, RAII violations, and algorithmic complexity.
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
        max_tokens: 1536,
    });

    const responseText = completion.choices[0].message.content.trim();
    // Clean up markdown code blocks if present
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanedText);
};

// Fallback heuristic analysis for C++
const analyzeWithHeuristics = (code) => {
    const hints = [];
    let logicError = null;

    // Check for division by zero
    if (code.includes('/ 0') || code.includes('/0')) {
        logicError = {
            message: "Potential division by zero detected",
            line: code.split('\n').findIndex(line => line.includes('/ 0') || line.includes('/0')) + 1,
            confidence: 0.9
        };
        hints.push(
            { type: "Nudge", content: "Check your division operations" },
            { type: "Clue", content: "Dividing by zero causes runtime errors" },
            { type: "Strategy", content: "Add a check to ensure the denominator is not zero before dividing" }
        );
    }
    // Check for potential memory leaks (new without delete)
    else if (code.includes('new ') && !code.includes('delete')) {
        logicError = {
            message: "Potential memory leak: 'new' without corresponding 'delete'",
            line: code.split('\n').findIndex(line => line.includes('new ')) + 1,
            confidence: 0.8
        };
        hints.push(
            { type: "Nudge", content: "Consider memory management" },
            { type: "Clue", content: "Every 'new' should have a corresponding 'delete'" },
            { type: "Strategy", content: "Use smart pointers (std::unique_ptr, std::shared_ptr) or add 'delete' to free memory" }
        );
    }
    // Check for uninitialized pointers
    else if (code.match(/\*\s*\w+\s*;/) && !code.includes('nullptr') && !code.includes('NULL')) {
        logicError = {
            message: "Potential uninitialized pointer usage",
            line: code.split('\n').findIndex(line => line.match(/\*\s*\w+\s*;/)) + 1,
            confidence: 0.7
        };
        hints.push(
            { type: "Nudge", content: "Initialize your pointers" },
            { type: "Clue", content: "Uninitialized pointers can cause undefined behavior" },
            { type: "Strategy", content: "Initialize pointers to nullptr or a valid address" }
        );
    }
    // Check for missing semicolons (basic check)
    else if (code.match(/(int|float|double|char|string)\s+\w+\s*=\s*[^;]+\n/)) {
        logicError = {
            message: "Possible missing semicolon",
            line: code.split('\n').findIndex(line => line.match(/(int|float|double|char|string)\s+\w+\s*=\s*[^;]+$/)) + 1,
            confidence: 0.6
        };
        hints.push(
            { type: "Nudge", content: "Check your syntax" },
            { type: "Clue", content: "C++ statements must end with a semicolon" },
            { type: "Strategy", content: "Add a semicolon at the end of the statement" }
        );
    }
    else {
        hints.push(
            { type: "Nudge", content: "Consider using RAII principles" },
            { type: "Clue", content: "Modern C++ encourages smart pointers and automatic resource management" },
            { type: "Strategy", content: "Use std::vector instead of raw arrays, and smart pointers instead of raw pointers" }
        );
    }

    return {
        logicError,
        hints,
        testCases: [
            { input: "Test with boundary values", pass: true },
            { input: "Test with edge cases", pass: true }
        ],
        complexity: {
            timeComplexity: "O(1)",
            timeExplanation: "Unable to analyze complexity without AI",
            spaceComplexity: "O(1)",
            spaceExplanation: "Unable to analyze complexity without AI",
            qualityScore: 5,
            suggestions: ["Use AI analysis for detailed complexity information"]
        }
    };
};

router.post('/', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        const analysis = await analyzeCodeWithAI(code);
        res.json(analysis);
    } catch (error) {
        console.error('AI analysis error:', error);
        // Fallback to heuristic analysis
        const fallbackAnalysis = analyzeWithHeuristics(code);
        res.json(fallbackAnalysis);
    }
});

module.exports = router;
