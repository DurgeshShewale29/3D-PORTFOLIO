'use client';

import { useState, useRef, useEffect } from 'react';
import { VscClose, VscClearAll, VscSend, VscLayoutSidebarRight, VscArrowRight } from 'react-icons/vsc';
import { profile, experience, projects, skills, education, certifications } from '@/portfolio.config';
import styles from '@/styles/CopilotChat.module.css';

interface Message {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
}

interface CopilotChatProps {
  isOpen: boolean;
  onClose: () => void;
}

import { SUGGESTED_CHIPS, answerQueryLocally } from '@/lib/copilotKnowledge';

export { SUGGESTED_CHIPS, answerQueryLocally };

export default function CopilotChat({ isOpen, onClose }: CopilotChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'copilot',
      text: `Hello! Ask me anything about Durgesh's background, engineering projects, or technical skills.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, streamingId]);

  // Clean up typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  // Support closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Typewriter streaming animation for Copilot answers
  const streamBotResponse = (fullReply: string) => {
    setIsTyping(false);
    const botMsgId = `b-${Date.now()}`;

    // Add empty message for bot
    setMessages(prev => [...prev, { id: botMsgId, sender: 'copilot', text: '' }]);
    setStreamingId(botMsgId);

    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }

    let charIndex = 0;
    // 30 FPS typing updates (32ms interval) cuts React re-renders in half for butter-smooth 60/120 FPS UI
    const chunkSize = Math.max(3, Math.ceil(fullReply.length / 45));

    typingTimerRef.current = setInterval(() => {
      charIndex += chunkSize;
      if (charIndex >= fullReply.length) {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setMessages(prev =>
          prev.map(m => (m.id === botMsgId ? { ...m, text: fullReply } : m))
        );
        setStreamingId(null);
      } else {
        const currentSlice = fullReply.slice(0, charIndex);
        setMessages(prev =>
          prev.map(m => (m.id === botMsgId ? { ...m, text: currentSlice } : m))
        );
      }
      scrollToBottom();
    }, 32);
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Call server chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          streamBotResponse(data.reply);
          return;
        }
      }
    } catch {}

    // Fallback to instant local knowledge engine
    setTimeout(() => {
      const replyText = answerQueryLocally(userText);
      streamBotResponse(replyText);
    }, 280);
  };

  const handleChipClick = (chipText: string) => {
    handleSend(chipText);
  };

  const handleClear = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setStreamingId(null);
    setIsTyping(false);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'copilot',
        text: `Chat cleared. What would you like to know about Durgesh?`,
      },
    ]);
  };

  return (
    <>
      {/* Dimmed backdrop to focus on Copilot overlay and smooth click-away */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside 
        className={`${styles.copilotOverlay} ${isOpen ? styles.copilotOverlayOpen : ''}`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <VscLayoutSidebarRight size={15} className={styles.headerIcon} />
            <span>Copilot</span>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handleClear}
              title="Clear Chat History"
            >
              <VscClearAll size={16} />
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={onClose}
              title="Close Panel (Esc)"
            >
              <VscClose size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messagesList}>
          {messages.map(msg => (
            <div key={msg.id} className={styles.messageRow}>
              <div
                className={`${styles.senderLabel} ${
                  msg.sender === 'user' ? styles.userLabel : styles.botLabel
                }`}
              >
                <span>{msg.sender === 'user' ? 'You' : 'Copilot'}</span>
              </div>
              <div
                className={`${styles.bubble} ${
                  msg.sender === 'user' ? styles.userBubble : styles.botBubble
                }`}
              >
                {msg.text ? (
                  msg.text.split('\n\n').map((para, i, arr) => (
                    <p key={i}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: para
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(
                              /\[(.*?)\]\((.*?)\)/g,
                              '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: underline;">$1</a>'
                            )
                            .replace(/\n/g, '<br />'),
                        }}
                      />
                      {streamingId === msg.id && i === arr.length - 1 && (
                        <span className={styles.blinkingCursor}>▍</span>
                      )}
                    </p>
                  ))
                ) : (
                  <span className={styles.blinkingCursor}>▍</span>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className={styles.messageRow}>
              <div className={`${styles.senderLabel} ${styles.botLabel}`}>
                <span>Copilot</span>
              </div>
              <div className={`${styles.bubble} ${styles.botBubble}`}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            </div>
          )}

          {/* Suggestion Queries (Exactly 4 clean pills on initial view) */}
          {messages.length <= 2 && (
            <div className={styles.chipsContainer}>
              <span className={styles.chipsLabel}>Suggested questions</span>
              <div className={styles.chipsGrid}>
                {SUGGESTED_CHIPS.map(chip => (
                  <button
                    key={chip}
                    type="button"
                    className={styles.chipBtn}
                    onClick={() => handleChipClick(chip)}
                  >
                    <span>{chip}</span>
                    <VscArrowRight size={12} className={styles.chipArrow} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <form
            className={styles.inputForm}
            onSubmit={e => {
              e.preventDefault();
              handleSend(input);
            }}
          >
            <input
              type="text"
              className={styles.inputField}
              placeholder="Ask a question about Durgesh..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || isTyping || !!streamingId}
              title="Send"
            >
              <VscSend size={14} />
            </button>
          </form>
          <span className={styles.inputHint}>Press Enter to send</span>
        </div>
      </aside>
    </>
  );
}
