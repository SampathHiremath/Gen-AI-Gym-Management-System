import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Dumbbell, Zap, Flame, Shield, Award, 
  CheckCircle, Play, ChevronRight, Activity, Heart, Clock, MapPin, 
  Send, Users
} from 'lucide-react';
import { api } from '../api/apiClient';
import { useNotification } from '../context/NotificationContext';

export default function HomePage({ onNavigate, onOpenAuth, onBookClass }) {
  const { showSuccess, showError } = useNotification();
  
  // Quick AI preview widget state
  const [quickGoal, setQuickGoal] = useState('hypertrophy');
  const [quickDays, setQuickDays] = useState(4);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [quickRoutine, setQuickRoutine] = useState(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const handleQuickGenerate = async () => {
    setPreviewLoading(true);
    try {
      const res = await api.generateWorkout({
        goal: quickGoal,
        days_per_week: quickDays,
        fitness_level: 'intermediate',
        split: quickDays === 3 ? 'full_body' : 'upper_lower'
      });
      setQuickRoutine(res.routine);
      showSuccess('AI Workout generated! Explore full routine below or in the GenAI Studio.');
    } catch (err) {
      showError('Could not generate preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      await api.submitContact({
        name: contactName,
        email: contactEmail,
        message: contactMessage
      });
      showSuccess('Message transmitted! A coach will reach out to you within 24 hours.');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (err) {
      showError(err.message || 'Failed to send message');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '90px 0 110px 0',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 20%, rgba(204, 255, 0, 0.08) 0%, rgba(10, 13, 20, 1) 75%)'
      }}>
        {/* Decorative Grid Lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 48px auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(204, 255, 0, 0.1)',
              border: '1px solid rgba(204, 255, 0, 0.3)',
              marginBottom: '24px'
            }}>
              <Sparkles size={16} color="var(--neon-lime)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--neon-lime)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Next-Gen 2026 AI Fitness Architecture
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              marginBottom: '24px'
            }}>
              FORGED BY IRON. <br />
              <span className="gradient-text-lime">POWERED BY GEN AI.</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '720px',
              margin: '0 auto 36px auto'
            }}>
              Experience the world's most advanced gym facility. Real-time Generative AI workout periodization, custom macro matrices, and Olympic barbell arenas designed to shatter your biological limits.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={() => onNavigate('ai-studio')}
                className="btn-primary"
                style={{ fontSize: '1rem', padding: '14px 32px' }}
              >
                <Sparkles size={18} />
                Launch GenAI Studio
              </button>
              <button
                onClick={() => onNavigate('classes')}
                className="btn-secondary"
                style={{ fontSize: '1rem', padding: '14px 28px' }}
              >
                Explore Classes & Timetable
              </button>
              <button
                onClick={() => onOpenAuth('demo')}
                className="btn-cyan"
                style={{ fontSize: '1rem', padding: '14px 28px' }}
              >
                <Zap size={18} />
                1-Click Demo Pass
              </button>
            </div>
          </div>

          {/* Quick AI Preview Widget Card */}
          <div className="glass-panel" style={{
            maxWidth: '920px',
            margin: '0 auto',
            padding: '28px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(204, 255, 0, 0.25)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="var(--neon-lime)" />
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Instant AI Workout Preview Generator</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Test our sports science engine with zero signup needed right now:
                </div>
              </div>
              <span className="badge-lime">Titan Neural Engine</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Your Fitness Goal
                </label>
                <select
                  value={quickGoal}
                  onChange={(e) => setQuickGoal(e.target.value)}
                  className="input-field"
                >
                  <option value="hypertrophy">Muscle Hypertrophy</option>
                  <option value="strength">Raw Strength & Power</option>
                  <option value="weight_loss">Fat Shred & Definition</option>
                  <option value="endurance">Cardio & Athletic Stamina</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Days Per Week
                </label>
                <select
                  value={quickDays}
                  onChange={(e) => setQuickDays(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={3}>3 Days / Week (Full Body)</option>
                  <option value={4}>4 Days / Week (Upper / Lower)</option>
                  <option value={5}>5 Days / Week (Push Pull Legs + Arms)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleQuickGenerate}
                  disabled={previewLoading}
                  className="btn-primary"
                  style={{ width: '100%', height: '46px' }}
                >
                  {previewLoading ? 'Synthesizing...' : 'Generate Routine'}
                </button>
              </div>
            </div>

            {/* Generated Quick Routine Result */}
            {quickRoutine && (
              <div style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ color: 'var(--neon-lime)', fontWeight: 800 }}>
                    {quickRoutine.title}
                  </h4>
                  <button
                    onClick={() => onNavigate('ai-studio')}
                    style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Open in Full Studio <ArrowRight size={14} />
                  </button>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {quickRoutine.overview}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {quickRoutine.weekly_schedule?.slice(0, 2).map((day, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '4px' }}>
                        Day {day.day_number}: {day.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                        {day.target_focus}
                      </div>
                      <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {day.exercises?.slice(0, 3).map((ex, exIdx) => (
                          <li key={exIdx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>&bull; {ex.name}</span>
                            <span style={{ color: 'var(--neon-lime)', fontWeight: 600 }}>{ex.sets}x{ex.reps}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. STATS COUNTER STRIP */}
      <section style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: '#0d1017',
        padding: '32px 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--neon-lime)' }}>99.4%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                AI Recommendation Accuracy
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--neon-cyan)' }}>18,500+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                AI Workout Protocols Generated
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>24/7/365</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Biometric Keycard Facility Access
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--neon-coral)' }}>4 Elite</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Master Performance Coaches
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR GEN AI PILLARS */}
      <section style={{ padding: '96px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
            <span className="badge-lime" style={{ marginBottom: '14px' }}>
              PULSE INTELLIGENCE ENGINE
            </span>
            <h2 className="section-title">
              THE 4 PILLARS OF <span className="gradient-text-lime">GEN AI FITNESS</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Standard gyms give you generic clipboards. Pulse AI pairs human exercise biomechanics with custom Generative AI agents.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '24px'
          }}>
            {/* Pillar 1 */}
            <div className="glass-panel glow-hover" style={{ padding: '32px', borderRadius: 'var(--radius-md)' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(204, 255, 0, 0.12)',
                border: '1px solid rgba(204, 255, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Dumbbell size={26} color="var(--neon-lime)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>
                AI Workout Periodizer
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Generates exact sets, rep schemes, rest countdowns, and progressive overload rules tailored to your training split, equipment, and injury history.
              </p>
              <button
                onClick={() => onNavigate('ai-studio')}
                style={{ color: 'var(--neon-lime)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Build My Routine <ChevronRight size={16} />
              </button>
            </div>

            {/* Pillar 2 */}
            <div className="glass-panel glow-hover" style={{ padding: '32px', borderRadius: 'var(--radius-md)' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Flame size={26} color="var(--neon-cyan)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>
                Precision Macro Matrix
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Computes BMR and TDEE using the Mifflin-St Jeor equation. Generates meal-by-meal athletic recipes with exact protein, carb, and healthy fat grams.
              </p>
              <button
                onClick={() => onNavigate('ai-studio')}
                style={{ color: 'var(--neon-cyan)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Calculate Macros <ChevronRight size={16} />
              </button>
            </div>

            {/* Pillar 3 */}
            <div className="glass-panel glow-hover" style={{ padding: '32px', borderRadius: 'var(--radius-md)' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255, 51, 102, 0.12)',
                border: '1px solid rgba(255, 51, 102, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Zap size={26} color="var(--neon-coral)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>
                24/7 PulseCoach AI
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Have a question about breaking a plateau, creatine dosing, DOMS soreness, or pre-workout timing? Chat directly with PulseCoach any time.
              </p>
              <button
                onClick={() => onNavigate('ai-studio')}
                style={{ color: 'var(--neon-coral)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Chat with PulseCoach <ChevronRight size={16} />
              </button>
            </div>

            {/* Pillar 4 */}
            <div className="glass-panel glow-hover" style={{ padding: '32px', borderRadius: 'var(--radius-md)' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(204, 255, 0, 0.12)',
                border: '1px solid rgba(204, 255, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Activity size={26} color="var(--neon-lime)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>
                Form & Readiness Diagnostics
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Biomechanical cues for compound lifts (Squat, Deadlift, Bench, OHP) and daily CNS recovery scoring to tell you if today is a PR day or deload day.
              </p>
              <button
                onClick={() => onNavigate('ai-studio')}
                style={{ color: 'var(--neon-lime)', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Check Form Cues <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED CLASSES BANNER */}
      <section style={{
        backgroundColor: '#0c0f18',
        padding: '90px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '20px' }}>
            <div>
              <span className="badge-cyan" style={{ marginBottom: '12px' }}>HIGH OCTANE SESSIONS</span>
              <h2 className="section-title">
                ELITE GROUP <span className="gradient-text-cyan">TRAINING CLASSES</span>
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>Led by master trainers, powered by high-tempo playlists and live metric tracking.</p>
            </div>
            <button
              onClick={() => onNavigate('classes')}
              className="btn-primary"
            >
              View Full Timetable <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                title: 'Titan Strength & Barbell Mastery',
                category: 'Strength & Power',
                trainer: 'Marcus Vance',
                duration: '60 Mins',
                burn: '450 - 550 kcal',
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
                badge: 'badge-lime'
              },
              {
                title: 'HIIT Hyperdrive 360',
                category: 'Metabolic Conditioning',
                trainer: 'Elena Rostova',
                duration: '45 Mins',
                burn: '600 - 850 kcal',
                image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
                badge: 'badge-coral'
              },
              {
                title: 'Combat Boxing Conditioning',
                category: 'Boxing & Agility',
                trainer: 'Jayden Thorne',
                duration: '55 Mins',
                burn: '550 - 750 kcal',
                image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80',
                badge: 'badge-cyan'
              }
            ].map((cls, idx) => (
              <div key={idx} className="glass-panel" style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                transition: 'var(--transition)'
              }}>
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={cls.image}
                    alt={cls.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px'
                  }}>
                    <span className={cls.badge}>{cls.category}</span>
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
                    {cls.title}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    <span>Coach: {cls.trainer}</span>
                    <span style={{ color: 'var(--neon-lime)', fontWeight: 600 }}>{cls.burn}</span>
                  </div>
                  <button
                    onClick={() => onNavigate('classes')}
                    className="btn-secondary"
                    style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
                  >
                    Reserve Spot in Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GYM AMENITIES SHOWCASE */}
      <section style={{ padding: '96px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
            <span className="badge-lime" style={{ marginBottom: '14px' }}>FACILITY AMENITIES</span>
            <h2 className="section-title">
              UNCOMPROMISED <span className="gradient-text-lime">IRON & LUXURY</span>
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Over 25,000 square feet of competition-grade powerlifting platforms, high-speed sprint turf, and therapeutic recovery zones.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                name: 'Eleiko Olympic Lifting Arenas',
                desc: 'Competition calibrated steel barbell plates, custom maple wood platforms, and IPF certified racks.',
                icon: Shield
              },
              {
                name: 'Cryotherapy & Cold Plunge Spa',
                desc: 'Sub-zero cryo chamber and 45°F cold water immersion plunge tubs for rapid muscular systemic recovery.',
                icon: Heart
              },
              {
                name: '40-Yard Indoor Sprint Turf',
                desc: 'High-traction athletic turf equipped with power sleds, plyometric soft boxes, and agility speed ladders.',
                icon: Zap
              },
              {
                name: 'Finnish Sauna & Steam Oasis',
                desc: 'Aromatic cedar saunas with infrared heating lamps to stimulate heat shock proteins and cellular detoxification.',
                icon: Flame
              }
            ].map((amenity, idx) => {
              const Icon = amenity.icon;
              return (
                <div key={idx} className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <Icon size={22} color="var(--neon-lime)" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                    {amenity.name}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {amenity.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION / CONTACT SECTION */}
      <section style={{
        padding: '80px 0',
        backgroundColor: '#0d1019',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div>
              <span className="badge-lime" style={{ marginBottom: '14px' }}>GET IN TOUCH</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '16px', lineHeight: 1.2 }}>
                READY TO EXPERIENCE <br />
                <span className="gradient-text-lime">THE PULSE DIFFERENCE?</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
                Book a VIP tour of the facility, speak with a certified strength coach, or ask any questions about our Gen AI membership plans.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={18} color="var(--neon-lime)" />
                  <span>742 Iron Forge Blvd, Downtown Metrowest</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={18} color="var(--neon-cyan)" />
                  <span>Open 24 Hours / 7 Days a Week for Members</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>
                Send a Message to Front Desk
              </h3>
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Steel"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="marcus@pulsefit.ai"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Message or Question
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="I would like to inquire about personal training and the AI VIP membership..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="input-field"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <Send size={16} />
                  {contactSubmitting ? 'Sending...' : 'Transmit Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
