import React from 'react';
import { Plus, X, Play, CheckCircle, XCircle, Loader } from 'lucide-react';

const TestCaseManager = ({ testCases, onTestCasesChange, onRunAll, isRunning }) => {
    const addTestCase = () => {
        const newTestCase = {
            id: Date.now(),
            input: '',
            expectedOutput: '',
            actualOutput: null,
            passed: null
        };
        onTestCasesChange([...testCases, newTestCase]);
    };

    const removeTestCase = (id) => {
        onTestCasesChange(testCases.filter(tc => tc.id !== id));
    };

    const updateTestCase = (id, field, value) => {
        onTestCasesChange(testCases.map(tc =>
            tc.id === id ? { ...tc, [field]: value } : tc
        ));
    };

    const passedCount = testCases.filter(tc => tc.passed === true).length;
    const failedCount = testCases.filter(tc => tc.passed === false).length;

    return (
        <div style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0.75rem'
        }}>
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                <div className="flex items-center gap-2">
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Test Cases</span>
                    {testCases.length > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ({passedCount} ✅ / {failedCount} ❌)
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onRunAll}
                        disabled={isRunning || testCases.length === 0}
                        className="btn"
                        style={{
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.75rem',
                            background: 'var(--success)',
                            borderColor: 'var(--success)',
                            color: 'white'
                        }}
                    >
                        {isRunning ? (
                            <>
                                <Loader size={14} className="animate-pulse" />
                                <span>Running...</span>
                            </>
                        ) : (
                            <>
                                <Play size={14} />
                                <span>Run All</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={addTestCase}
                        className="btn"
                        style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                    >
                        <Plus size={14} />
                        <span>Add</span>
                    </button>
                </div>
            </div>

            {/* Test Cases List */}
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {testCases.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '1rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem'
                    }}>
                        No test cases. Click "Add" to create one.
                    </div>
                ) : (
                    testCases.map((tc, index) => (
                        <div
                            key={tc.id}
                            style={{
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.5rem',
                                marginBottom: '0.5rem',
                                border: `1px solid ${tc.passed === true ? 'var(--success)' :
                                        tc.passed === false ? 'var(--error)' :
                                            'var(--border-accent)'
                                    }`
                            }}
                        >
                            {/* Test Case Header */}
                            <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                                <div className="flex items-center gap-2">
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                        Test {index + 1}
                                    </span>
                                    {tc.passed === true && <CheckCircle size={14} color="var(--success)" />}
                                    {tc.passed === false && <XCircle size={14} color="var(--error)" />}
                                </div>
                                <button
                                    onClick={() => removeTestCase(tc.id)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                        padding: '0.25rem'
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Input Field */}
                            <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                                    Input:
                                </label>
                                <textarea
                                    value={tc.input}
                                    onChange={(e) => updateTestCase(tc.id, 'input', e.target.value)}
                                    placeholder="Enter input..."
                                    style={{
                                        width: '100%',
                                        minHeight: '40px',
                                        padding: '0.375rem',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-accent)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.75rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            {/* Expected Output Field */}
                            <div style={{ marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                                    Expected Output:
                                </label>
                                <textarea
                                    value={tc.expectedOutput}
                                    onChange={(e) => updateTestCase(tc.id, 'expectedOutput', e.target.value)}
                                    placeholder="Enter expected output..."
                                    style={{
                                        width: '100%',
                                        minHeight: '40px',
                                        padding: '0.375rem',
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-accent)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.75rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            {/* Actual Output (if run) */}
                            {tc.actualOutput !== null && (
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                                        Actual Output:
                                    </label>
                                    <div style={{
                                        padding: '0.375rem',
                                        background: 'var(--bg-primary)',
                                        border: `1px solid ${tc.passed ? 'var(--success)' : 'var(--error)'}`,
                                        borderRadius: 'var(--radius-sm)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.75rem',
                                        whiteSpace: 'pre-wrap',
                                        color: tc.passed ? 'var(--success)' : 'var(--error)'
                                    }}>
                                        {tc.actualOutput || '(empty)'}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TestCaseManager;
