'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [examples] = useState([
    "Which product has the most votes?",
    "Are there any AI products launched today?",
    "What are the top 3 products?",
    "Find products about design"
  ]);

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setAnswer('');
    
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question})
      });
      const data = await res.json();
      setAnswer(data.answer || data.error || 'No response');
    } catch (err) {
      setAnswer('Unable to connect. Please try again.');
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      askQuestion();
    }
  };

  const handleExample = (example: string) => {
    setQuestion(example);
    setTimeout(() => {
      const input = document.querySelector('input');
      input?.focus();
    }, 100);
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: '#FAFAFA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '1rem',
      color: '#1d1d1f'
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        animation: 'fadeIn 0.8s ease'
      }}>
        {/* Logo/Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '600',
            letterSpacing: '-0.02em',
            margin: '0 0 12px 0',
            background: 'linear-gradient(180deg, #1d1d1f 0%, #86868b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Product Hunt AI
          </h1>
          <p style={{
            fontSize: '21px',
            color: '#86868b',
            fontWeight: '400',
            margin: 0
          }}>
            Ask anything about today's products
          </p>
        </div>

        {/* Input Section */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '8px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          marginBottom: '24px',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about Product Hunt..."
              disabled={loading}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '17px',
                padding: '16px 20px',
                background: 'transparent',
                color: '#1d1d1f',
                fontWeight: '400'
              }}
            />
            <button
              onClick={askQuestion}
              disabled={loading || !question.trim()}
              style={{
                background: loading ? '#86868b' : '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '12px 24px',
                fontSize: '17px',
                fontWeight: '500',
                cursor: loading || !question.trim() ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: loading || !question.trim() ? 0.6 : 1,
                marginRight: '4px'
              }}
            >
              {loading ? '...' : 'Ask'}
            </button>
          </div>
        </div>

        {/* Example Questions */}
        {!answer && (
          <div style={{
            marginBottom: '40px'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#86868b',
              marginBottom: '12px',
              fontWeight: '500',
              letterSpacing: '0.02em'
            }}>
              TRY ASKING
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleExample(example)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E5E7',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    fontSize: '15px',
                    color: '#1d1d1f',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: '400'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#007AFF';
                    e.currentTarget.style.color = '#007AFF';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#E5E5E7';
                    e.currentTarget.style.color = '#1d1d1f';
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Answer Section */}
        {answer && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            animation: 'slideUp 0.4s ease',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div style={{
              fontSize: '17px',
              lineHeight: '1.6',
              color: '#1d1d1f',
              whiteSpace: 'pre-wrap'
            }}>
              {answer}
            </div>
            <button
              onClick={() => {
                setAnswer('');
                setQuestion('');
              }}
              style={{
                marginTop: '24px',
                background: 'transparent',
                border: '1px solid #E5E5E7',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '15px',
                color: '#86868b',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '400'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#007AFF';
                e.currentTarget.style.color = '#007AFF';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#E5E5E7';
                e.currentTarget.style.color = '#86868b';
              }}
            >
              Ask another question
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::placeholder {
          color: #86868b;
          opacity: 1;
        }
      `}</style>
    </main>
  );
}
