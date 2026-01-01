# C++ Code Mentor

A real-time AI-powered code mentor that helps you write better C++ code. Get instant feedback on memory leaks, logic errors, and code quality while you write.

## Why I Built This

As a C++ developer, I got tired of spending hours debugging memory leaks and pointer errors. I wanted a tool that could catch these issues in real-time and explain them in a way that actually helps me learn. So I built this.

## What It Does

This isn't just another code editor. It's a complete learning environment that:

- **Analyzes your code in real-time** using AI (Groq's Llama 3.3 70B)
- **Catches memory issues** before they become bugs (leaks, dangling pointers, buffer overflows)
- **Runs your code** with custom inputs using the Piston API
- **Explains complexity** in plain English (Big O notation, optimization tips)
- **Answers your questions** through an AI chat interface

## Features

### Code Analysis
- Real-time error detection
- Memory safety checks
- 3-level progressive hints (subtle → specific → solution)
- Works offline with pattern-based fallback

### Code Execution
- Run C++ code directly in the browser
- Add custom input (stdin)
- See output, errors, and exit codes
- Multiple test cases with pass/fail indicators

### AI Assistant
- Ask questions about your code
- Get explanations in context
- Learn best practices
- Optimization suggestions

### Developer Experience
- VS Code-style Monaco editor
- Keyboard shortcuts (Ctrl+Enter to run, Ctrl+Shift+H for hints)
- Modern, clean UI
- Tabbed interface (Analysis | Chat | Complexity)

## Getting Started

### Prerequisites
- Node.js 18 or higher
- A free Groq API key ([get one here](https://console.groq.com/))

### Installation

1. Clone this repo:
```bash
git clone https://github.com/Puneeth-R-140/Code_mentor.git
cd Code_mentor
```

2. Install dependencies:
```bash
npm install
cd server && npm install && cd ..
```

3. Set up your API key:
```bash
cd server
cp .env.example .env
```

Open `server/.env` and add your Groq API key:
```
GROQ_API_KEY=your_key_here
```

4. Start the app:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

5. Open http://localhost:5173 in your browser

## How to Use

### Running Code
1. Write your C++ code in the editor
2. Add input in the "Program Input" section if needed
3. Press `Ctrl+Enter` or click "Run Code"
4. Check the output below

### Getting Help
1. Click "Get Hint" or press `Ctrl+Shift+H`
2. See the analysis in the right panel
3. Switch between Analysis, Chat, and Complexity tabs
4. Ask questions in the Chat tab

### Testing Multiple Cases
1. Click "+ Add" in the Test Cases section
2. Enter input and expected output
3. Click "Run All" to test everything at once
4. See which tests pass or fail

## Tech Stack

**Frontend:**
- React 18 + Vite
- Monaco Editor (VS Code's editor)
- Vanilla CSS with modern design

**Backend:**
- Express.js
- Groq SDK (AI inference)
- Piston API (code execution)

**Why These Choices:**
- Groq: Free tier with 14,400 requests/day, super fast
- Piston: Secure sandboxed execution, no setup needed
- Monaco: Best-in-class code editor with C++ support

## Project Structure

```
Code_mentor/
├── src/                    # Frontend
│   ├── components/         # React components
│   ├── App.jsx            # Main app
│   └── index.css          # Styles
├── server/                # Backend
│   ├── routes/            # API endpoints
│   │   ├── analyze.js     # Code analysis
│   │   ├── execute.js     # Code execution
│   │   └── chat.js        # AI chat
│   └── index.js           # Server entry
└── README.md
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/analyze` | POST | Analyze code for errors and complexity |
| `/api/execute` | POST | Run C++ code with input |
| `/api/chat` | POST | Chat with AI about your code |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Run code |
| `Ctrl+Shift+H` | Get AI hint |
| `Ctrl+K` | Clear editor |

## Examples

### Memory Leak Detection
```cpp
int* ptr = new int[100];
// Using ptr...
// Forgot to delete!
```
**AI catches this:** "Memory leak detected. You allocated memory with `new[]` but never freed it with `delete[]`."

### Complexity Analysis
```cpp
for(int i = 0; i < n; i++) {
    for(int j = 0; j < n; j++) {
        // nested loop
    }
}
```
**AI explains:** "Time complexity: O(n²). Consider using a hash map to reduce to O(n)."

## Troubleshooting

**Backend won't start?**
- Check if port 3000 is already in use
- Make sure you added your Groq API key to `.env`
- Restart after changing `.env`

**Frontend won't start?**
- Check if port 5173 is in use
- Try `rm -rf node_modules && npm install`

**Features not working?**
- Make sure both backend and frontend are running
- Check browser console for errors
- Verify your API key is valid

## Contributing

Found a bug? Have an idea? Feel free to open an issue or submit a PR. I'm always looking to improve this.

## What's Next

Things I'm planning to add:
- Support for more languages (Python, Java)
- Code snippets library
- Save/load code sessions
- Collaborative coding
- VS Code extension

## License

MIT License - feel free to use this for your own projects.

## Acknowledgments

- Groq for the amazing free AI API
- Piston for secure code execution
- Monaco Editor team for the editor
- Everyone who's given feedback

---

Built by Puneeth R. If this helped you, consider giving it a star ⭐

Questions? Open an issue or reach out.
