import React from 'react';
import { Dumbbell, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      backgroundColor: '#07090e',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      paddingTop: '64px',
      paddingBottom: '32px',
      marginTop: '80px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '56px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ccff00 0%, #00f0ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Dumbbell size={20} color="#000" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '1px' }}>
                PULSE <span style={{ color: 'var(--neon-lime)' }}>AI</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
              Where peak human athletic conditioning merges with advanced Generative AI. Hyper-personalized routines, real-time biomechanics, and precision nutrition.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="badge-lime" style={{ fontSize: '0.72rem' }}>
                <ShieldCheck size={14} /> MySQL 8.0 Verified
              </span>
              <span className="badge-cyan" style={{ fontSize: '0.72rem' }}>
                Gemini 1.5 Flash
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'AI Fitness Studio', id: 'ai-studio' },
                { label: 'Workout Generator', id: 'ai-studio' },
                { label: 'Macro & Meal Planner', id: 'ai-studio' },
                { label: 'Group Class Timetable', id: 'classes' },
                { label: 'Elite Coaches & Trainers', id: 'trainers' },
                { label: 'Membership Tiers', id: 'pricing' },
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => { onNavigate(link.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => (e.target.style.color = 'var(--neon-lime)')}
                    onMouseOut={(e) => (e.target.style.color = 'var(--text-muted)')}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Gym Facility & Hours */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Facility & Hours
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Clock size={18} color="var(--neon-lime)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>24/7 Keycard Access</div>
                  <div>Front Desk: Mon - Fri: 5am - 11pm</div>
                  <div>Weekends: 7am - 9pm</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={18} color="var(--neon-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>Pulse Flagship Facility</div>
                  <div>742 Iron Forge Blvd, Downtown Metrowest</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Get In Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--neon-lime)" />
                <span>+1 (800) 555-PULSE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--neon-cyan)" />
                <span>concierge@pulsefit.ai</span>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Powered by Django REST Framework, React 19, PyMySQL & Google Gemini AI.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.82rem',
          color: 'var(--text-dim)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} Pulse AI Gym & Fitness Systems. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built for Champions with <Heart size={14} color="var(--neon-coral)" fill="var(--neon-coral)" /> and Artificial Intelligence.
          </div>
        </div>
      </div>
    </footer>
  );
}
