import React from 'react';
import { Terminal, CheckCircle, XCircle, Clock } from 'lucide-react';

const OutputPanel = ({ output, isRunning }) => {
    if (isRunning) {
        return (
            <div className="output-panel animate-slide-in" style={{
                padding: '1rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                margin: '0.5rem'
            }}>
                <div className="flex items-center gap-2 animate-pulse">
                    <Terminal size={20} color="var(--accent-primary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>Running code...</span>
                </div>
            </div>
        );
    }

    if (!output) {
        return (
            <div className="output-panel" style={{
                padding: '1rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                margin: '0.5rem',
                color: 'var(--text-muted)',
                textAlign: 'center'
            }}>
                <Terminal size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p>Click "Run Code" to see output</p>
            </div>
        );
    }

    const hasError = output.error && output.error.trim().length > 0;
    const hasOutput = output.output && output.output.trim().length > 0;

    return (
        <div className="output-panel animate-slide-in" style={{
            padding: '1rem',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            margin: '0.5rem'
        }}>
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                <div className="flex items-center gap-2">
                    <Terminal size={18} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Output</span>
                </div>
                {output.success ? (
                    <div className="flex items-center gap-1" style={{ color: 'var(--success)', fontSize: '0.75rem' }}>
                        <CheckCircle size={14} />
                        <span>Success</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1" style={{ color: 'var(--error)', fontSize: '0.75rem' }}>
                        <XCircle size={14} />
                        <span>Failed</span>
                    </div>
                )}
            </div>

            {/* Output Content */}
            {hasOutput && (
                <div style={{
                    background: 'var(--bg-primary)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: hasError ? '0.75rem' : 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto',
                    color: 'var(--text-primary)'
                }}>
                    {output.output}
                </div>
            )}

            {/* Error Content */}
            {hasError && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--error)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto',
                    color: 'var(--error)'
                }}>
                    {output.error}
                </div>
            )}

            {/* Exit Code */}
            {output.exitCode !== undefined && (
                <div style={{
                    marginTop: '0.75rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Clock size={12} />
                    <span>Exit code: {output.exitCode}</span>
                </div>
            )}
        </div>
    );
};

export default OutputPanel;
