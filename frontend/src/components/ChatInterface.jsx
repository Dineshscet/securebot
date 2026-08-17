import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, Sparkles, ShieldAlert, Award } from 'lucide-react';
import ChatMessage from './ChatMessage';

export default function ChatInterface({
  messages,
  onSendMessage,
  onClearHistory,
  isLoading,
  selectedPayload,
  newUnlocked
}) {
  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Update input when payload selected from sidebar
  useEffect(() => {
    if (selectedPayload) {
      setInputPrompt(selectedPayload);
    }
  }, [selectedPayload]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    onSendMessage(inputPrompt);
    setInputPrompt('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <main style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'rgba(9, 13, 22, 0.4)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Unlocked Toast Banner */}
      {newUnlocked && (
        <div className="animate-fade-in" style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          backgroundColor: 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '999px',
          boxShadow: '0 0 24px rgba(16, 185, 129, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          <Award style={{ width: '20px', height: '20px' }} />
          <span>OBJECTIVE UNLOCKED! Confidential detail extracted!</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Welcome Card */}
        {messages.length === 0 && (
          <div className="glass-card animate-fade-in" style={{
            padding: '24px',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '680px',
            margin: '40px auto 20px auto',
            border: '1px solid var(--border-active)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 24px var(--accent-cyan-glow)'
            }}>
              <Bot style={{ width: '32px', height: '32px', color: '#ffffff' }} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>
              Acme Global Systems - SecureBot Sandbox
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
              SecureBot is configured as the automated employee & customer virtual assistant for Acme Global Systems. It has been programmed with standard corporate policies as well as <strong>5 strictly confidential company secrets</strong> guarded by safety directives.
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles style={{ width: '14px', height: '14px' }} />
                Target: Extract CTF Flag & Secrets
              </div>

              <div style={{
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ShieldAlert style={{ width: '14px', height: '14px' }} />
                Classroom Attack Sandbox
              </div>
            </div>
          </div>
        )}

        {/* Message Log */}
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="glass-card animate-fade-in" style={{
            padding: '12px 18px',
            borderRadius: '12px',
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: '6px 0'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-cyan)'
            }} className="animate-pulse-glow" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              SecureBot is analyzing your prompt...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{
        padding: '16px 24px 20px 24px',
        backgroundColor: 'rgba(9, 13, 22, 0.9)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          position: 'relative'
        }}>
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your prompt attack payload here... (Press Enter to submit, Shift+Enter for new line)"
            rows={2}
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-sans)',
              resize: 'none',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-cyan)';
              e.target.style.boxShadow = '0 0 16px var(--accent-cyan-glow)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-subtle)';
              e.target.style.boxShadow = 'none';
            }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClearHistory}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              title="Clear input"
            >
              <Trash2 style={{ width: '18px', height: '18px' }} />
            </button>

            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              style={{
                height: '44px',
                padding: '0 20px',
                borderRadius: '10px',
                background: !inputPrompt.trim() || isLoading
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
                border: 'none',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: !inputPrompt.trim() || isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: !inputPrompt.trim() || isLoading ? 'none' : '0 0 16px var(--accent-cyan-glow)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Inject</span>
              <Send style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
