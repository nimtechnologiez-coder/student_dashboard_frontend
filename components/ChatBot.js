'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Sparkles } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'bot', text: 'Hello! 👋 I\'m your Nim Academy assistant. How can I help you today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [chatHistory, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newUserMessage = {
            role: 'user',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatHistory(prev => [...prev, newUserMessage]);
        setMessage('');
        setIsTyping(true);

        // Simulated Bot Response
        setTimeout(() => {
            const botResponse = {
                role: 'bot',
                text: getBotResponse(message),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatHistory(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const getBotResponse = (input) => {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('course') || lowerInput.includes('learn')) {
            return "We offer a wide range of courses including AI Automation, Python, and Digital Marketing! Check our 'Explore Categories' section above.";
        } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
            return "Most of our premium courses are available for as low as ₹519. Check individual course cards for specific pricing.";
        } else if (lowerInput.includes('certificate')) {
            return "Yes! You get a certificate of completion for every course you finish at Nim Academy.";
        } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hi there! Welcome to Nim Academy. What's on your mind?";
        }
        return "That's a great question! For specific inquiries, you can also reach us at support@nimacademy.com.";
    };

    const suggestions = [
        "What courses do you have?",
        "Tell me about certificates",
        "How much do courses cost?",
        "Can I talk to support?"
    ];

    const handleSuggestionClick = (suggestion) => {
        const newUserMessage = {
            role: 'user',
            text: suggestion,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, newUserMessage]);
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = {
                role: 'bot',
                text: getBotResponse(suggestion),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatHistory(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="chatbot-wrapper">
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}
                aria-label="Toggle Chat"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
                {!isOpen && (
                    <span className="chatbot-notification-dot"></span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window animate-chat-slide-up">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <div className="chatbot-avatar">
                                <Bot size={20} className="text-black" />
                                <span className="online-indicator"></span>
                            </div>
                            <div>
                                <h3 className="chatbot-title">Nim Assistant</h3>
                                <p className="chatbot-status">AI Powered • Online</p>
                            </div>
                        </div>
                        <div className="chatbot-header-actions">
                            <Sparkles size={16} className="text-gray-400 mr-2" />
                            <button onClick={() => setIsOpen(false)} className="text-black/60 hover:text-black">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="chatbot-body">
                        {chatHistory.map((item, index) => (
                            <div key={index} className={`chat-message-group ${item.role === 'user' ? 'user' : 'bot'}`}>
                                <div className="chat-avatar-small">
                                    {item.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                </div>
                                <div className="chat-message">
                                    <p className="chat-text">{item.text}</p>
                                    <span className="chat-time">{item.time}</span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="chat-message-group bot">
                                <div className="chat-avatar-small"><Bot size={12} /></div>
                                <div className="chat-message chat-typing">
                                    <span className="chat-dot"></span>
                                    <span className="chat-dot"></span>
                                    <span className="chat-dot"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions Area */}
                    <div className="chatbot-suggestions-container">
                        {suggestions.map((s, i) => (
                            <button key={i} onClick={() => handleSuggestionClick(s)} className="suggestion-chip">
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="chatbot-input-area">
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="chatbot-input"
                        />
                        <button type="submit" className="chatbot-send-btn" disabled={!message.trim()}>
                            <Send size={18} />
                        </button>
                    </form>

                    <div className="chatbot-footer">
                        Powered by Nim Academy AI
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
