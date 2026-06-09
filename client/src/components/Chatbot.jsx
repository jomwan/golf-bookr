import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styles from '../styles/Chatbot.module.css';
import api from '../services/api';

const formatAIMessage = (message) => {
    return message.split('\n').map((line, i) => {
        if (!line.trim()) return null;
        
        if (line.startsWith('►')) {
            return <h3 key={i} className={styles.sectionHeader}>{line}</h3>;
        } else if (line.startsWith('•')) {
            return <span key={i} className={styles.bulletPoint}>{line.substring(1).trim()}</span>;
        } else if (line.startsWith('⛳')) {
            return <h4 key={i} className={styles.courseTitle}>{line}</h4>;
        } else if (line.startsWith('─')) {
            return <hr key={i} className={styles.divider} />;
        } else {
            return <span key={i} className={styles.textLine}>{line}</span>;
        }
    }).filter(Boolean);
};

const Chatbot = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { text: "⛳ Tee off! I'm CawFee, your elite golf concierge. Looking for tomorrow's best slots or a specific difficulty layout? Tell me your group size and preferences!", isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    // Scroll to bottom whenever messages list changes
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post('/chat', { 
                message: userMessage 
            });
            
            if (response.data.success) {
                setMessages(prev => [...prev, { 
                    text: response.data.message, 
                    isUser: false 
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setMessages(prev => [...prev, { 
                    text: error.response?.data?.message || "My apologies. I'm experiencing a brief connection delay on the fairway.", 
                    isUser: false 
                }]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.container}>
            <div className="text-center mb-4">
                <Typography variant="h2" gutterBottom>CawFee AI Assistant</Typography>
                <div className="gold-text fw-semibold">PERSONAL GOLF CONCIERGE</div>
            </div>
            
            <div className={styles.chatWindow}>
                {messages.map((message, index) => (
                    <div 
                        key={index} 
                        className={message.isUser ? styles.userMessage : styles.aiMessage}
                    >
                        {message.isUser ? (
                            message.text
                        ) : (
                            <div className={styles.formattedMessage}>
                                {formatAIMessage(message.text)}
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className={styles.aiMessage}>
                        <div className={styles.typingIndicator}>
                            <div className={styles.typingDot} />
                            <div className={styles.typingDot} />
                            <div className={styles.typingDot} />
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className={styles.inputContainer}>
                <input
                    className="form-control"
                    placeholder="Ask CawFee about courses, tee-times, or bookings..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                    style={{ flex: 1 }}
                />
                <button
                    className="btn btn-primary rounded-pill d-flex align-items-center gap-2"
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    style={{ height: '50px', padding: '0 25px' }}
                >
                    <span>Send</span>
                    <SendIcon style={{ fontSize: '16px' }} />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;