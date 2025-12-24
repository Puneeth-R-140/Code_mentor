const express = require('express');
const router = express.Router();

// Piston API endpoint
const PISTON_API = 'https://emkc.org/api/v2/piston';

router.post('/', async (req, res) => {
    const { code, input = '' } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        // Call Piston API to execute C++ code
        const response = await fetch(`${PISTON_API}/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: 'c++',
                version: '10.2.0',
                files: [
                    {
                        name: 'main.cpp',
                        content: code
                    }
                ],
                stdin: input,
                args: [],
                compile_timeout: 10000,
                run_timeout: 3000,
                compile_memory_limit: -1,
                run_memory_limit: -1
            })
        });

        if (!response.ok) {
            throw new Error('Piston API request failed');
        }

        const result = await response.json();

        // Format the response
        const executionResult = {
            success: !result.compile || result.compile.code === 0,
            output: result.run?.output || '',
            error: result.run?.stderr || result.compile?.stderr || '',
            exitCode: result.run?.code || 0,
            executionTime: result.run?.signal ? 'Timeout' : 'N/A'
        };

        res.json(executionResult);
    } catch (error) {
        console.error('Execution error:', error);
        res.status(500).json({
            error: 'Execution failed',
            details: error.message
        });
    }
});

module.exports = router;
