import React, { useState } from 'react';
import { Code, Zap, Play, Settings, Sparkles } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import MentorPanel from './components/MentorPanel';
import OutputPanel from './components/OutputPanel';

function App() {
  const [code, setCode] = useState("// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // In a real app, we might debounce this and send to backend for real-time checks
  };

  const handleGetHint = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);

    // ============================================================
    // BACKEND API TEMPORARILY DISABLED
    // To restore: Uncomment the try-catch block below
    // ============================================================

    /* COMMENTED OUT - RESTORE LATER
    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error fetching hints:", error);
      // Fallback or error state could be handled here
    } finally {
      setIsAnalyzing(false);
    }
    */

    // Temporary: Show "No response" message
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysis({
        logicError: null,
        hints: [
          { type: "Nudge", content: "Backend API is currently disconnected." },
          { type: "Clue", content: "No analysis available at this time." },
          { type: "Strategy", content: "The AI mentor will provide feedback once reconnected." }
        ],
        testCases: []
      });
    }, 500);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const response = await fetch('http://localhost:3000/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Execution failed');
      }

      const result = await response.json();
      setOutput(result);
    } catch (error) {
      console.error("Error running code:", error);
      setOutput({
        success: false,
        output: '',
        error: 'Failed to execute code. Make sure the backend server is running.',
        exitCode: -1
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <header style={{
        height: '60px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        background: 'var(--bg-secondary)',
        justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-2">
          <Code size={24} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>
            Code<span style={{ color: 'var(--accent-primary)' }}>Mentor</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="btn" onClick={() => setAnalysis(null)}>
            <Settings size={18} />
            <span>Reset</span>
          </button>
          <button
            className="btn"
            onClick={handleRunCode}
            disabled={isRunning}
            style={{ background: 'var(--success)', borderColor: 'var(--success)', color: 'white' }}
          >
            {isRunning ? (
              <span className="flex items-center gap-2">Running...</span>
            ) : (
              <>
                <Play size={18} />
                <span>Run Code</span>
              </>
            )}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleGetHint}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">Analyzing...</span>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Get Hint</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Code Editor + Output Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          {/* Code Editor - Takes 60% */}
          <div style={{
            height: '60%',
            display: 'flex',
            flexDirection: 'column',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <CodeEditor code={code} onChange={handleCodeChange} />
          </div>

          {/* Output Panel - Takes 40% */}
          <div style={{
            height: '40%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            background: 'var(--bg-secondary)'
          }}>
            <OutputPanel output={output} isRunning={isRunning} />
          </div>
        </div>

        {/* Right: Mentor Panel Area */}
        <div style={{ width: '400px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)' }}>
          <div className="panel-header" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="var(--warning)" />
            Real-Time Analysis
          </div>
          <div className="panel-content" style={{ flex: 1, overflowY: 'auto' }}>
            <MentorPanel analysis={analysis} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
