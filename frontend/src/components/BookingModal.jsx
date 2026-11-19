import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, CheckCircle2 } from 'lucide-react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import confetti from 'canvas-confetti';

export default function BookingModal({ schedule, onClose, onBookingSuccess }) {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);

  if (!schedule) return null;

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.bookClass({
        schedule_id: schedule.id,
        user_id: user?.id,
        booking_date: bookingDate
      });
      showSuccess(res.message || 'Spot booked successfully!');
      confetti({ particleCount: 60, spread: 60 });
      if (onBookingSuccess) onBookingSuccess();
      onClose();
    } catch (err) {
      showError(err.message || 'Failed to reserve spot');
    } finally {
      setLoading(false);
    }
  };

  const gclass = schedule.gym_class;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          backgroundColor: '#0f1420',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span className="badge-lime">{schedule.day_of_week}</span>
          <span className="badge-cyan">{schedule.room}</span>
        </div>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
          {gclass?.title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Coach: {gclass?.trainer?.name || 'Lead Trainer'} &bull; {gclass?.duration_minutes} Mins
        </p>

        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Select Reservation Date
            </label>
            <input
              type="date"
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Time Slot:</span>
              <strong style={{ color: '#fff' }}>{schedule.start_time} - {schedule.end_time}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Location:</span>
              <strong style={{ color: '#fff' }}>{schedule.room}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Available Spots:</span>
              <strong style={{ color: 'var(--neon-lime)' }}>{schedule.available_spots ?? gclass?.capacity} spots left</strong>
            </div>
          </div>

          {!user && (
            <div style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)', textAlign: 'center' }}>
              * You are booking as Guest / Demo athlete. Create an account to track all reservations!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '6px' }}
          >
            {loading ? 'Reserving Spot...' : (
              <>
                <CheckCircle2 size={18} />
                Confirm My Spot
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
