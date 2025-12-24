require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function testGroq() {
    console.log("Testing Groq API...");
    console.log("API Key:", process.env.GROQ_API_KEY ? "Present" : "Missing");

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: "Say hello in one word" }
            ],
            model: "llama-3.3-70b-versatile",
        });

        console.log("✅ Groq API Test Successful!");
        console.log("Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("❌ Groq API Test Failed!");
        console.error("Error:", error.message);
    }
}

testGroq();
