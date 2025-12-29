import React from 'react';
import { Activity, Clock, Zap } from 'lucide-react';

const ComplexityPanel = ({ complexity }) => {
    if (!complexity) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Activity size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>Click "Get Hint" to analyze code complexity</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '1rem' }}>
            {/* Time Complexity */}
            <div style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--border-accent)'
            }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                    <Clock size={18} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 600 }}>Time Complexity</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {complexity.timeComplexity || 'N/A'}
                </div>
                {complexity.timeExplanation && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {complexity.timeExplanation}
                    </p>
                )}
            </div>

            {/* Space Complexity */}
            <div style={{
                background: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--border-accent)'
            }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                    <Zap size={18} color="var(--accent-secondary)" />
                    <span style={{ fontWeight: 600 }}>Space Complexity</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    {complexity.spaceComplexity || 'N/A'}
                </div>
                {complexity.spaceExplanation && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {complexity.spaceExplanation}
                    </p>
                )}
            </div>

            {/* Quality Score */}
            {complexity.qualityScore !== undefined && (
                <div style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    border: '1px solid var(--border-accent)'
                }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                        <Activity size={18} color="var(--success)" />
                        <span style={{ fontWeight: 600 }}>Code Quality</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                        {complexity.qualityScore}/10
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {complexity.suggestions && complexity.suggestions.length > 0 && (
                <div style={{
                    background: 'var(--bg-tertiary)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-accent)'
                }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>
                        💡 Optimization Suggestions
                    </div>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                        {complexity.suggestions.map((suggestion, index) => (
                            <li key={index} style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ComplexityPanel;
