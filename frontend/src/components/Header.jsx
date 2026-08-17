import React from 'react';
import { Shield, RefreshCw, Sparkles, Terminal, Info } from 'lucide-react';

export default function Header({ statusInfo, onReset, isResetting, onToggleHelp }) {
  const isLive = statusInfo?.gemini_api_configured;

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'relative',
      zIndex: 20
    }}>
      {/* Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)'
        }}>
          <Shield style={{ width: '22px', height: '22px', color: '#ffffff' }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
              SecureBot
            </h1>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              AGS AI Assistant
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Prompt Injection Security Workshop Target Platform
          </p>
        </div>
      </div>

      {/* Action Controls & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: isLive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: `1px solid ${isLive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: 500
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isLive ? 'var(--accent-emerald)' : 'var(--accent-amber)',
            boxShadow: `0 0 8px ${isLive ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`
          }} className="animate-pulse-glow" />
          <span style={{ color: isLive ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
            {isLive ? 'AI Backend Connected' : 'Simulation Mode'}
          </span>
        </div>

        {/* Reset Chat Button */}
        <button
          onClick={onReset}
          disabled={isResetting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <RefreshCw style={{
            width: '14px',
            height: '14px',
            transform: isResetting ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.5s ease'
          }} />
          <span>Reset Session</span>
        </button>

        {/* Info Help Toggle */}
        <button
          onClick={onToggleHelp}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            color: 'var(--accent-cyan)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Lab Instructions"
        >
          <Info style={{ width: '18px', height: '18px' }} />
        </button>
      </div>
    </header>
  );
}
