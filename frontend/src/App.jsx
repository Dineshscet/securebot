import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { X, ShieldAlert, Sparkles, BookOpen, Terminal, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [completedObjectives, setCompletedObjectives] = useState([]);
  const [statusInfo, setStatusInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [selectedPayload, setSelectedPayload] = useState('');
  const [newUnlocked, setNewUnlocked] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://securebot-backend.onrender.com').replace(/\/$/, '');

  // Fetch initial objectives and health status
  useEffect(() => {
    fetchHealthStatus();
    fetchObjectives();
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health/`);
      if (res.ok) {
        const data = await res.json();
        setStatusInfo(data);
      }
    } catch (err) {
      console.warn("API health check warning:", err);
      setStatusInfo({ gemini_api_configured: false, status: 'offline' });
    }
  };

  const fetchObjectives = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/objectives/`);
      if (res.ok) {
        const data = await res.json();
        setObjectives(data.objectives || []);
      }
    } catch (err) {
      console.warn("Failed to fetch objectives:", err);
    }
  };

  // Send message to Django backend API
  const handleSendMessage = async (userPrompt) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message to state
    const updatedMessages = [
      ...messages,
      { role: 'user', content: userPrompt, timestamp }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          history: updatedMessages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content
          }))
        })
      });

      const data = await response.json();

      if (response.ok) {
        const botReply = data.reply || "No response received.";
        setMessages(prev => [
          ...prev,
          { role: 'model', content: botReply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);

        // Evaluate newly completed objectives
        if (data.objectives_completed && data.objectives_completed.length > 0) {
          setCompletedObjectives(prev => {
            const newCompleted = new Set([...prev, ...data.objectives_completed]);
            if (newCompleted.size > prev.length) {
              setNewUnlocked(true);
              setTimeout(() => setNewUnlocked(false), 4000);
            }
            return Array.from(newCompleted);
          });
        }
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'model', content: `⚠️ Error: ${data.error || 'Failed to fetch response from server.'}`, timestamp }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'model', content: `⚠️ Network Error: Unable to connect to Django API backend at ${API_BASE_URL}. Ensure server is running!`, timestamp }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset chat session
  const handleReset = async () => {
    setIsResetting(true);
    try {
      await fetch(`${API_BASE_URL}/api/reset/`, { method: 'POST' });
    } catch (e) {
      // ignore network issue on reset
    }
    setMessages([]);
    setCompletedObjectives([]);
    setIsResetting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <Header
        statusInfo={statusInfo}
        onReset={handleReset}
        isResetting={isResetting}
        onToggleHelp={() => setShowHelpModal(true)}
      />

      <div className="app-container">
        <Sidebar
          objectives={objectives}
          completedObjectives={completedObjectives}
          onSelectPayload={(payload) => setSelectedPayload(payload)}
        />

        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          onClearHistory={handleReset}
          isLoading={isLoading}
          selectedPayload={selectedPayload}
          newUnlocked={newUnlocked}
        />
      </div>

      {/* Workshop Guidelines Help Modal */}
      {showHelpModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px'
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '640px',
            width: '100%',
            padding: '28px',
            borderRadius: '16px',
            position: 'relative',
            border: '1px solid var(--border-active)'
          }}>
            <button
              onClick={() => setShowHelpModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}>
                <BookOpen style={{ width: '22px', height: '22px' }} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                Prompt Injection Workshop Guide
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <p>
                Welcome to tomorrow's <strong>Prompt Injection Security Class & Demonstration</strong>!
                This application acts as a target company chatbot (SecureBot) configured with hidden company secrets in its system instructions.
              </p>

              <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                <h4 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>Key Class Demonstration Targets:</h4>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-primary)' }}>
                  <li><strong>CTF Secret Flag:</strong> FLAG&#123;p1_m4st3r_4cm3_2026_s3cr3t&#125;</li>
                  <li><strong>Project Aegis:</strong> Q4 Stealth Quantum Encryption Platform & Dr. Aris Vance</li>
                  <li><strong>IT Override Code:</strong> ACME-OVERRIDE-9984-ALPHA (VP Sarah Jenkins)</li>
                  <li><strong>PostgreSQL DB Connection:</strong> Admin credentials & db host</li>
                  <li><strong>Executive Salaries:</strong> E-9 tier compensation breakdown</li>
                </ul>
              </div>

              <p>
                <strong>Setting your API Key:</strong> Open <code>backend/.env</code> and configure your API key for live responses.
              </p>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
                border: 'none',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Start Lab Demonstration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
