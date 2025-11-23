import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { subscribeToMessages, sendMessage } from '../firebaseService';
import { format } from 'date-fns';

const GroupChat = ({ isOpen, onClose, group, user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!group || !isOpen) return;

        const unsubscribe = subscribeToMessages(group.id, (msgs) => {
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [group, isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await sendMessage(
                group.id,
                user.uid,
                user.displayName || 'User',
                newMessage.trim()
            );
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return format(date, 'HH:mm');
    };

    return (
        <div className={`chat-container ${isOpen ? 'open' : ''}`}>
            {/* Chat Header */}
            <div style={{
                padding: 'var(--spacing-md)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--color-surface)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageCircle size={20} style={{ color: 'var(--color-primary)' }} />
                    <div>
                        <div style={{ fontWeight: 600, color: 'white' }}>
                            {group?.name || 'Group Chat'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {Object.keys(group?.members || {}).length} members
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="btn-secondary"
                    style={{ padding: '0.5rem', borderRadius: '50%' }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">💬</div>
                        <p>No messages yet</p>
                        <p style={{ fontSize: '0.875rem' }}>Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`chat-message ${msg.userId === user.uid ? 'own' : ''} ${msg.type === 'expense-notification' ? 'notification' : ''}`}
                        >
                            {msg.type === 'expense-notification' ? (
                                <div>{msg.text}</div>
                            ) : (
                                <>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0.25rem'
                                    }}>
                                        <span style={{
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            color: msg.userId === user.uid ? 'var(--color-primary)' : 'var(--color-accent)'
                                        }}>
                                            {msg.userId === user.uid ? 'You' : msg.userName}
                                        </span>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {formatMessageTime(msg.createdAt)}
                                        </span>
                                    </div>
                                    <div style={{ color: 'var(--color-text)' }}>
                                        {msg.text}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="chat-input-container">
                <input
                    type="text"
                    className="input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    style={{ flex: 1 }}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={sending || !newMessage.trim()}
                    style={{ padding: '0.75rem' }}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default GroupChat;
