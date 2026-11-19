import React, { useState } from 'react';
import { Dumbbell, Sparkles, Calendar, Users, Award, User, LogOut, Menu, X, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentPage, setCurrentPage, onOpenAuth }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'ai-studio', label: 'GenAI Studio', badge: 'AI 2026', icon: Sparkles },
    { id: 'classes', label: 'Classes & Timetable', icon: Calendar },
    { id: 'trainers', label: 'Elite Coaches', icon: Users },
    { id: 'pricing', label: 'Memberships', icon: Award },
    ...(user ? [{ id: 'dashboard', label: 'My Dashboard', icon: User }] : []),
  ];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ccff00 0%, #00f0ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(204, 255, 0, 0.4)'
          }}>
            <Dumbbell size={22} color="#000" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '1px' }}>PULSE</span>
              <span style={{
                background: '#ccff00',
                color: '#000',
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 900
              }}>AI</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Next-Gen Fitness
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          {navLinks.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--neon-lime)' : 'var(--text-muted)',
                  transition: 'var(--transition)',
                  position: 'relative',
                  padding: '6px 0'
                }}
              >
                {Icon && <Icon size={16} />}
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: 'linear-gradient(90deg, #ccff00, #00f0ff)',
                    color: '#000',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '20px',
                    marginLeft: '4px'
                  }}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--neon-lime)',
                    boxShadow: '0 0 10px var(--neon-lime)'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth / Action Button */}
        <div style={{ display: 'none', alignItems: 'center', gap: '14px' }} className="desktop-nav">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={() => handleNavClick('dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'var(--transition)'
                }}
              >
                <img
                  src={user.profile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={user.username}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user.first_name || user.username}</span>
              </button>
              <button
                onClick={logout}
                title="Logout"
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '6px' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('demo')}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                <Zap size={15} />
                Demo Athlete
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'flex', color: '#fff', padding: '8px' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0d111a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                textAlign: 'left',
                padding: '10px 0',
                fontSize: '1rem',
                color: currentPage === item.id ? 'var(--neon-lime)' : 'var(--text-main)',
                fontWeight: currentPage === item.id ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '0.7rem',
                  background: 'var(--neon-lime)',
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 800
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '10px' }}>
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                Logout ({user.username})
              </button>
            ) : (
              <>
                <button
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onOpenAuth('demo'); setMobileMenuOpen(false); }}
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  Demo Pass
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Responsive media style injection */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
