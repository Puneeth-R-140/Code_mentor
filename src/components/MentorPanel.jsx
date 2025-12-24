import React, { useState } from 'react';
import { AlertTriangle, Lightbulb, CheckCircle, ChevronDown, ChevronRight, Bug } from 'lucide-react';

const MentorPanel = ({ analysis }) => {
    const [expandedHint, setExpandedHint] = useState(null);

    if (!analysis) {
        return (
            <div className="panel-content" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <Bug size={48} style={{ opacity: 0.2 }} />
                </div>
                <p>Start typing or click "Get Hint" to receive AI mentorship.</p>
            </div>
        );
    }

    const { logicError, hints, testCases } = analysis;

    return (
        <div className="mentor-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>

            {/* Logic Error Section */}
            {logicError && (
                <div className="card error-card" style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--error)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem'
                }}>
                    <div className="flex items-center gap-2" style={{ color: 'var(--error)', marginBottom: '0.5rem', fontWeight: '600' }}>
                        <AlertTriangle size={18} />
                        <span>Potential Logic Error</span>
                        <span style={{ fontSize: '0.8rem', background: 'var(--error)', color: 'white', padding: '2px 6px', borderRadius: '12px', marginLeft: 'auto' }}>
                            {Math.round(logicError.confidence * 100)}% Conf.
                        </span>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{logicError.message}</p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Location: Line {logicError.line}
                    </div>
                </div>
            )}

            {/* Hints Section */}
            {hints && hints.length > 0 && (
                <div className="hints-section">
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', items: 'center', gap: '0.5rem' }}>
                        <Lightbulb size={18} color="var(--warning)" />
                        Hints
                    </h3>
                    <div className="flex flex-col gap-2">
                        {hints.map((hint, index) => (
                            <div key={index} className="hint-item" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                <button
                                    onClick={() => setExpandedHint(expandedHint === index ? null : index)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: 'var(--bg-tertiary)',
                                        border: 'none',
                                        color: 'var(--text-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span style={{ fontWeight: '500' }}>Level {index + 1}: {hint.type}</span>
                                    {expandedHint === index ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                                {expandedHint === index && (
                                    <div style={{ padding: '1rem', background: 'var(--bg-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        {hint.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Test Cases Section */}
            {testCases && testCases.length > 0 && (
                <div className="test-cases-section">
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', items: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={18} color="var(--info)" />
                        Test Cases
                    </h3>
                    <div className="flex flex-col gap-2">
                        {testCases.map((test, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.9rem',
                                fontFamily: 'var(--font-mono)'
                            }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Input: {test.input}</span>
                                <span style={{ color: test.pass ? 'var(--success)' : 'var(--error)' }}>
                                    {test.pass ? 'Pass' : 'Fail'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorPanel;
