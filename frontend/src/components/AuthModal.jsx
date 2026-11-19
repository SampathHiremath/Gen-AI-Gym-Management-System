import React, { useState } from 'react';
import { X, Lock, Mail, User, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('hypertrophy');
  const [fitnessLevel, setFitnessLevel] = useState('intermediate');
  const [loading, setLoading] = useState(false);

  const { login, register, demoLogin } = useAuth();
  const { showSuccess, showError } = useNotification();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(username, password);
        showSuccess('Welcome back to Pulse AI Gym!');
      } else {
        await register({
          username,
          password,
          email,
          first_name: firstName,
          fitness_goal: fitnessGoal,
          fitness_level: fitnessLevel
        });
        showSuccess('Account created! Welcome to the squad.');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
      onClose();
    } catch (err) {
      showError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await demoLogin();
      showSuccess('Logged in as Demo Athlete (Alex Mercer)!');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onClose();
    } catch (err) {
      showError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          backgroundColor: '#0f1420',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '8px 12px',
            borderRadius: '20px',
            background: 'rgba(204, 255, 0, 0.1)',
            color: 'var(--neon-lime)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '12px'
          }}>
            <ShieldCheck size={16} style={{ marginRight: '6px' }} />
            PULSE ATHLETE PORTAL
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {mode === 'login' ? 'Member Sign In' : 'Join the Elite Club'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            {mode === 'login' ? 'Access your saved AI workouts & meal plans' : 'Start your AI-powered body transformation'}
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(204, 255, 0, 0.15) 0%, rgba(0, 240, 255, 0.1) 100%)',
          border: '1px solid rgba(204, 255, 0, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600, marginBottom: '8px' }}>
            Test driving the website? Skip forms instantly:
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', fontSize: '0.88rem', padding: '10px' }}
          >
            <Zap size={16} />
            Instant 1-Click Demo Sign In
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>or with credentials</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Your First Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chris"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                  <input
                    type="email"
                    required
                    placeholder="chris@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                required
                placeholder="athlete_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Primary Goal
                </label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="hypertrophy">Muscle Gain</option>
                  <option value="strength">Raw Strength</option>
                  <option value="weight_loss">Fat Loss</option>
                  <option value="endurance">Endurance</option>
                  <option value="general">Longevity</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Experience Level
                </label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-cyan"
            style={{ width: '100%', marginTop: '10px', padding: '12px' }}
          >
            {loading ? 'Processing...' : (
              <>
                <span>{mode === 'login' ? 'Sign In to Portal' : 'Create My Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle mode */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ color: 'var(--neon-lime)', fontWeight: 700 }}
              >
                Sign Up Here
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ color: 'var(--neon-lime)', fontWeight: 700 }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
