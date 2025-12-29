import React, { useState, useEffect } from 'react';
import { Code, Zap, Play, Settings, Sparkles, MessageSquare, Activity, BarChart3 } from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import MentorPanel from './components/MentorPanel';
import OutputPanel from './components/OutputPanel';
import TestCaseManager from './components/TestCaseManager';
import ChatPanel from './components/ChatPanel';
import ComplexityPanel from './components/ComplexityPanel';

function App() {
  const [code, setCode] = useState("// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}");
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // New states for additional features
  const [activeTab, setActiveTab] = useState('analysis');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [complexity, setComplexity] = useState(null);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Enter: Run code
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
      // Ctrl+Shift+H: Get hint
      else if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        handleGetHint();
      }
      // Ctrl+K: Clear editor
      else if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setCode('// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, userInput]);

  const handleGetHint = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setComplexity(null);

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

      // Extract complexity if available
      if (data.complexity) {
        setComplexity(data.complexity);
      }
    } catch (error) {
      console.error("Error fetching hints:", error);
      setAnalysis({
        logicError: null,
        hints: [
          { type: "Nudge", content: "Unable to connect to AI service." },
          { type: "Clue", content: "Make sure the backend server is running." },
          { type: "Strategy", content: "Start the server with: cd server && npm run dev" }
        ],
        testCases: []
      });
    } finally {
      setIsAnalyzing(false);
    }
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
        body: JSON.stringify({ code, input: userInput }),
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

  const handleRunAllTests = async () => {
    if (testCases.length === 0) return;

    setIsRunningTests(true);
    const updatedTestCases = [];

    for (const testCase of testCases) {
      try {
        const response = await fetch('http://localhost:3000/api/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, input: testCase.input }),
        });

        const result = await response.json();
        const actualOutput = result.output.trim();
        const expectedOutput = testCase.expectedOutput.trim();
        const passed = actualOutput === expectedOutput;

        updatedTestCases.push({
          ...testCase,
          actualOutput,
          passed
        });
      } catch (error) {
        updatedTestCases.push({
          ...testCase,
          actualOutput: 'Error: ' + error.message,
          passed: false
        });
      }
    }

    setTestCases(updatedTestCases);
    setIsRunningTests(false);
  };

  const handleSendMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          message,
          history: chatMessages
        }),
      });

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running.'
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
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
        {/* Left: Code Editor + Test Cases + Output Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          {/* Code Editor - Takes 45% */}
          <div style={{
            height: '45%',
            display: 'flex',
            flexDirection: 'column',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <CodeEditor code={code} onChange={handleCodeChange} />
          </div>

          {/* Test Cases Manager */}
          <TestCaseManager
            testCases={testCases}
            onTestCasesChange={setTestCases}
            onRunAll={handleRunAllTests}
            isRunning={isRunningTests}
          />

          {/* Output Panel - Takes remaining space */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            background: 'var(--bg-secondary)'
          }}>
            <OutputPanel
              output={output}
              isRunning={isRunning}
              userInput={userInput}
              onInputChange={setUserInput}
            />
          </div>
        </div>

        {/* Right: Tabbed Panel Area */}
        <div style={{ width: '400px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)' }}>
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-tertiary)'
          }}>
            <button
              onClick={() => setActiveTab('analysis')}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: activeTab === 'analysis' ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                color: activeTab === 'analysis' ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeTab === 'analysis' ? 600 : 400,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <Zap size={16} />
              <span>Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: activeTab === 'chat' ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                color: activeTab === 'chat' ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeTab === 'chat' ? 600 : 400,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <MessageSquare size={16} />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('complexity')}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: activeTab === 'complexity' ? 'var(--accent-gradient)' : 'transparent',
                border: 'none',
                color: activeTab === 'complexity' ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: activeTab === 'complexity' ? 600 : 400,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <Activity size={16} />
              <span>Complexity</span>
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'analysis' && <MentorPanel analysis={analysis} />}
            {activeTab === 'chat' && (
              <ChatPanel
                code={code}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
              />
            )}
            {activeTab === 'complexity' && <ComplexityPanel complexity={complexity} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
