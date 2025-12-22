import React, { useState, useEffect, useRef } from 'react';
import useOtp from '../../hooks/useOtp';

const CODE_LENGTH = 6;

export default function OtpForm({ 
  initialEmail = '', 
  onVerified,
  autoSubmit = true,
  title = "Verificação por Email"
}) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [stage, setStage] = useState(initialEmail ? 'input-code' : 'input-email');
  const [countdown, setCountdown] = useState(30);
  const { loading, error, sendOtp, verifyOtp } = useOtp();
  const inputRefs = useRef(Array(CODE_LENGTH).fill().map(() => React.createRef()));

  useEffect(() => {
    if (stage === 'input-code' && initialEmail) {
      handleRequest();
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0 || stage !== 'input-code') return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, stage]);

  const handleRequest = async (e) => {
    if (e) e.preventDefault();
    try {
      await sendOtp(email);
      setStage('input-code');
      setCountdown(30);
      // Auto-focus primeiro input
      setTimeout(() => inputRefs.current[0].current?.focus(), 100);
    } catch (err) {
      console.error('Erro ao enviar OTP:', err);
    }
  };

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus próximo input
    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1].current?.focus();
    }

    // Auto-submit quando completo
    if (autoSubmit && index === CODE_LENGTH - 1 && text) {
      handleVerify(null, newCode.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].current?.focus();
    }
  };

  const handleVerify = async (e, fullCode = code.join('')) => {
    if (e) e.preventDefault();
    if (fullCode.length < CODE_LENGTH) return;
    
    try {
      await verifyOtp(email, fullCode);
      if (onVerified) onVerified();
    } catch (err) {
      // Reset code on error
      setCode(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0].current?.focus();
    }
  };

  const resetAndResend = async () => {
    setCode(Array(CODE_LENGTH).fill(''));
    await handleRequest();
  };

  const isCodeComplete = code.every(c => c !== '');
  const showResend = countdown <= 0;

  return (
    <div className="otp-form">
      <div className="otp-header">
        <h2>{title}</h2>
      </div>

      {stage === 'input-email' && (
        <form onSubmit={handleRequest} className="email-form">
          <div className="form-group">
            <label htmlFor="email">Informe seu e-mail</label>
            <input 
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              required 
              className="email-input"
              placeholder="seu@email.com"
            />
          </div>
          <button type="submit" disabled={loading} className="send-btn">
            {loading ? 'Enviando...' : 'Enviar código'}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      )}

      {stage === 'input-code' && (
        <div className="code-form">
          <p className="code-subtitle">
            Código enviado para: <strong>{email}</strong>
          </p>
          
          <div className="code-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs.current[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`code-input ${digit ? 'filled' : ''}`}
                disabled={loading}
              />
            ))}
          </div>

          {!autoSubmit && (
            <button
              onClick={() => handleVerify()}
              disabled={loading || !isCodeComplete}
              className="verify-btn"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          )}

          <div className="resend-section">
            {!showResend ? (
              <p className="countdown">Reenviar em {countdown}s</p>
            ) : (
              <button
                onClick={resetAndResend}
                disabled={loading}
                className="resend-btn"
              >
                Reenviar código
              </button>
            )}
          </div>

          <button 
            onClick={() => setStage('input-email')} 
            className="back-btn"
            disabled={loading}
          >
            Alterar email
          </button>

          {error && <div className="error">{error}</div>}
        </div>
      )}

      <style jsx>{`
        .otp-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .otp-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .otp-header h2 {
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #374151;
          font-weight: 500;
        }

        .email-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .email-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .send-btn, .verify-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-bottom: 1rem;
        }

        .send-btn:hover:not(:disabled), .verify-btn:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .send-btn:disabled, .verify-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .code-subtitle {
          text-align: center;
          color: #6b7280;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .code-inputs {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .code-input {
          width: 3rem;
          height: 3rem;
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          outline: none;
          transition: all 0.2s;
        }

        .code-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .code-input.filled {
          border-color: #10b981;
          background-color: #f0fdf4;
        }

        .code-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .resend-section {
          text-align: center;
          margin-bottom: 1rem;
        }

        .countdown {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0;
        }

        .resend-btn {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          text-decoration: underline;
          font-size: 0.9rem;
        }

        .resend-btn:hover:not(:disabled) {
          color: #2563eb;
        }

        .back-btn {
          width: 100%;
          padding: 0.5rem;
          background: none;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #6b7280;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .back-btn:hover:not(:disabled) {
          border-color: #9ca3af;
          color: #374151;
        }

        .error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-top: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
