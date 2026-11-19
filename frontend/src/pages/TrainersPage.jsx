import React, { useState, useEffect } from 'react';
import { Star, Award, Globe, CheckCircle, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { api } from '../api/apiClient';
import { useNotification } from '../context/NotificationContext';

export default function TrainersPage({ onNavigate }) {
  const { showError, showSuccess } = useNotification();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      const data = await api.getTrainers();
      setTrainers(data);
    } catch (err) {
      showError('Failed to load coaches directory');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTrainer = (trainerName) => {
    showSuccess(`Private 1-on-1 request for Coach ${trainerName} logged. Front desk will contact you!`);
  };

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 56px auto' }}>
          <span className="badge-lime" style={{ marginBottom: '14px' }}>MASTER PERFORMANCE FACULTY</span>
          <h1 className="section-title">
            ELITE HUMAN <span className="gradient-text-lime">COACHING MASTERS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Even with the planet's best Generative AI, human coaching intuition and hands-on cueing remain supreme. Meet our championship instructors.
          </p>
        </div>

        {/* Coaches Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px'
        }}>
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="glass-panel glow-hover"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Photo */}
              <div style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={trainer.image_url}
                  alt={trainer.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(10, 13, 20, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--neon-lime)'
                }}>
                  <Star size={14} fill="var(--neon-lime)" color="var(--neon-lime)" />
                  <span>{trainer.rating}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({trainer.reviews_count})</span>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '4px' }}>
                    {trainer.name}
                  </h3>
                  <div style={{ color: 'var(--neon-cyan)', fontSize: '0.86rem', fontWeight: 600, marginBottom: '14px' }}>
                    {trainer.title}
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {trainer.bio}
                  </p>

                  {/* Specialties Tags */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Specialties
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {trainer.specialties?.map((spec, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: '#cbd5e1',
                            border: '1px solid rgba(255, 255, 255, 0.06)'
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Experience:</span>
                    <strong style={{ color: '#fff' }}>{trainer.experience_years} Years Pro</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleBookTrainer(trainer.name)}
                      className="btn-primary"
                      style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                    >
                      Book 1-on-1 Session
                    </button>
                    <button
                      onClick={() => onNavigate('classes')}
                      className="btn-secondary"
                      style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                      title="View Trainer's Classes"
                    >
                      Classes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
