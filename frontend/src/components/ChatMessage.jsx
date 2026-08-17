import React, { useState } from 'react';
import { Shield, User, Copy, Check, AlertTriangle, Key, Award } from 'lucide-react';

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);
  const isBot = message.role === 'model' || message.role === 'bot';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render text with markdown code snippets
  const renderFormattedContent = (text) => {
    if (!text) return null;

    // Split by code block syntax ```
    const parts = text.split(/```/g);

    return parts.map((part, index) => {
      // Odd indices are code blocks
      if (index % 2 === 1) {
        return (
          <pre key={index}>
            <code>{part.trim()}</code>
          </pre>
        );
      }

      // Even indices are regular text - parse bolding or line breaks
      const lines = part.split('\n');
      return (
        <span key={index}>
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {line}
              {lIdx < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    });
  };

  // Check if message leaked CTF flag or secrets
  const hasSecretFlag = message.content && (message.content.includes('FLAG{') || message.content.includes('PROJECT AEGIS') || message.content.includes('ACME-OVERRIDE'));

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        gap: '14px',
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: isBot
          ? (hasSecretFlag ? 'rgba(244, 63, 94, 0.08)' : 'rgba(15, 23, 42, 0.6)')
          : 'rgba(30, 41, 59, 0.5)',
        border: hasSecretFlag
          ? '1px solid rgba(244, 63, 94, 0.4)'
          : (isBot ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.05)'),
        maxWidth: '88%',
        alignSelf: isBot ? 'flex-start' : 'flex-end',
        margin: '6px 0',
        position: 'relative'
      }}
    >
      {/* Avatar Icon */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        backgroundColor: isBot ? 'var(--accent-cyan)' : 'var(--accent-indigo)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: isBot ? '0 0 12px var(--accent-cyan-glow)' : 'none'
      }}>
        {isBot ? (
          <Shield style={{ width: '18px', height: '18px', color: '#ffffff' }} />
        ) : (
          <User style={{ width: '18px', height: '18px', color: '#ffffff' }} />
        )}
      </div>

      {/* Content Container */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {/* Header line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
              {isBot ? 'SecureBot' : 'Classroom Hacker / Auditor'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {message.timestamp || 'Just now'}
            </span>

            {hasSecretFlag && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--accent-rose)',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(244, 63, 94, 0.3)'
              }}>
                <Award style={{ width: '12px', height: '12px' }} />
                PROMPT INJECTION SUCCESSFUL
              </span>
            )}
          </div>

          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem'
            }}
            title="Copy message text"
          >
            {copied ? (
              <>
                <Check style={{ width: '14px', height: '14px', color: 'var(--accent-emerald)' }} />
                <span style={{ color: 'var(--accent-emerald)' }}>Copied</span>
              </>
            ) : (
              <Copy style={{ width: '14px', height: '14px' }} />
            )}
          </button>
        </div>

        {/* Message body */}
        <div style={{
          fontSize: '0.92rem',
          color: isBot ? 'var(--text-primary)' : '#e2e8f0',
          lineHeight: '1.6',
          wordBreak: 'break-word'
        }}>
          {renderFormattedContent(message.content)}
        </div>
      </div>
    </div>
  );
}
