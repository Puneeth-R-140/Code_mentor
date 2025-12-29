import React, { useState } from 'react';
import { MessageSquare, Send, Loader } from 'lucide-react';

const ChatPanel = ({ code, messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>Ask me anything about your code!</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            Examples: "What does this code do?", "How can I optimize this?"
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                marginBottom: '1rem',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: msg.role === 'user' ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                                border: `1px solid ${msg.role === 'user' ? 'var(--accent-primary)' : 'var(--border-accent)'}`,
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                {msg.role === 'user' ? 'You' : 'AI Assistant'}
                            </div>
                            <div style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <Loader size={24} className="animate-pulse" color="var(--accent-primary)" />
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            AI is thinking...
                        </p>
                    </div>
                )}
            </div>

            {/* Input */}
            <div style={{ borderTop: '1px solid var(--border-color)', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about your code..."
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            minHeight: '60px',
                            padding: '0.5rem',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-accent)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            resize: 'vertical'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="btn btn-primary"
                        style={{ alignSelf: 'flex-end', padding: '0.5rem 1rem' }}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Press Enter to send, Shift+Enter for new line
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
