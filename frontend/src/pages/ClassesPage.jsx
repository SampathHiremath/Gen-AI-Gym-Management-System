import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Flame, User, MapPin, CheckCircle, ArrowRight, Filter } from 'lucide-react';
import { api } from '../api/apiClient';
import { useNotification } from '../context/NotificationContext';

export default function ClassesPage({ onSelectScheduleForBooking }) {
  const { showError } = useNotification();
  const [classes, setClasses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedDay]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classesRes, schedulesRes] = await Promise.all([
        api.getClasses(selectedCategory !== 'all' ? selectedCategory : null),
        api.getSchedules({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          day: selectedDay !== 'all' ? selectedDay : undefined
        })
      ]);
      setClasses(classesRes);
      setSchedules(schedulesRes);
    } catch (err) {
      showError('Failed to load gym classes');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'strength', label: 'Strength & Iron' },
    { id: 'hiit', label: 'Metabolic HIIT' },
    { id: 'yoga', label: 'Yoga & Recovery' },
    { id: 'boxing', label: 'Combat Boxing' },
    { id: 'crossfit', label: 'CrossFit Rig' },
    { id: 'cycling', label: 'Pulse Cycle' },
  ];

  const days = ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px auto' }}>
          <span className="badge-lime" style={{ marginBottom: '14px' }}>GROUP TRAINING SESSIONS</span>
          <h1 className="section-title">
            CLASSES & <span className="gradient-text-lime">WEEKLY TIMETABLE</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Book your session in our high-energy studio environments led by elite master coaches. Real-time capacity and instant reservation.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '28px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: 700,
                background: selectedCategory === cat.id ? 'var(--neon-lime)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat.id ? '#000' : 'var(--text-muted)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'var(--transition)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Day Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '48px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: selectedDay === d ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                color: selectedDay === d ? 'var(--neon-cyan)' : 'var(--text-dim)',
                border: `1px solid ${selectedDay === d ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.05)'}`,
                textTransform: 'capitalize'
              }}
            >
              {d === 'all' ? 'Every Day' : d}
            </button>
          ))}
        </div>

        {/* Live Schedules Grid */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>
          Available Class Sessions ({schedules.length})
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading timetable...
          </div>
        ) : schedules.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {schedules.map((item) => {
              const gclass = item.gym_class;
              return (
                <div
                  key={item.id}
                  className="glass-panel glow-hover"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={gclass?.image_url}
                      alt={gclass?.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                      <span className="badge-lime">{item.day_of_week}</span>
                      <span className="badge-cyan">{gclass?.intensity}</span>
                    </div>
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
                        {gclass?.title}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '16px' }}>
                        {gclass?.description}
                      </p>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        marginBottom: '18px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <Clock size={15} color="var(--neon-lime)" />
                          <span>{item.start_time} - {item.end_time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <Flame size={15} color="var(--neon-coral)" />
                          <span>{gclass?.calories_burn_est}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <User size={15} color="var(--neon-cyan)" />
                          <span>Coach: {gclass?.trainer?.name.split(' ')[0]}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <MapPin size={15} color="#fff" />
                          <span>{item.room}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--neon-lime)', fontWeight: 700 }}>{item.available_spots}</span>
                        <span style={{ color: 'var(--text-dim)' }}> spots left</span>
                      </div>
                      <button
                        onClick={() => onSelectScheduleForBooking(item)}
                        className="btn-primary"
                        style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                      >
                        Reserve Spot
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
            <Calendar size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
            <h3>No classes scheduled for the selected filter combination.</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Try switching day or discipline filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
