import React, { useState, useEffect } from 'react';
import { 
  User, Dumbbell, Utensils, Calendar, Settings, ShieldCheck, 
  Trash2, Download, ExternalLink, Key, Award, Flame, Zap
} from 'lucide-react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function DashboardPage({ onNavigate }) {
  const { user, refreshProfile, geminiKey, setGeminiKey } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [activeTab, setActiveTab] = useState('workouts'); // workouts, meals, bookings, settings
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [savedMeals, setSavedMeals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Settings form state
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [weightKg, setWeightKg] = useState(user?.profile?.weight_kg || 78);
  const [targetWeightKg, setTargetWeightKg] = useState(user?.profile?.target_weight_kg || 82);
  const [fitnessGoal, setFitnessGoal] = useState(user?.profile?.fitness_goal || 'hypertrophy');
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [workouts, meals, myBookings, sub] = await Promise.all([
        api.getSavedWorkouts(user.id),
        api.getSavedMealPlans(user.id),
        api.getMyBookings(user.id),
        api.getCurrentSubscription(user.id)
      ]);
      setSavedWorkouts(workouts);
      setSavedMeals(meals);
      setBookings(myBookings);
      setSubscription(sub?.subscription);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.cancelBooking(bookingId);
      showSuccess('Class reservation cancelled');
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      showError('Failed to cancel reservation');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.updateProfile({
        user_id: user.id,
        user: { first_name: firstName },
        profile: {
          weight_kg: Number(weightKg),
          target_weight_kg: Number(targetWeightKg),
          fitness_goal: fitnessGoal
        }
      });
      await refreshProfile();
      showSuccess('Profile & biometric telemetry updated successfully!');
    } catch (err) {
      showError('Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Please Sign In or Launch Demo Mode to access your Athlete Dashboard</h2>
      </div>
    );
  }

  const profile = user.profile || {};

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Athlete Profile Header Banner */}
        <div className="glass-panel" style={{
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={user.username}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--neon-lime)',
                boxShadow: '0 0 20px var(--neon-lime-glow)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                  {user.first_name || user.username}
                </h1>
                <span className="badge-lime">
                  <ShieldCheck size={14} /> Verified Member
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                Objective: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{profile.fitness_goal}</strong> &bull; Level: <strong style={{ color: 'var(--neon-cyan)', textTransform: 'capitalize' }}>{profile.fitness_level}</strong>
              </div>
              {subscription && (
                <div style={{ marginTop: '8px' }}>
                  <span className="badge-cyan">
                    <Award size={14} /> {subscription.plan?.name} ({subscription.billing_cycle})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onNavigate('ai-studio')}
              className="btn-primary"
              style={{ fontSize: '0.88rem', padding: '10px 20px' }}
            >
              <Zap size={16} />
              AI Studio
            </button>
            <button
              onClick={() => onNavigate('classes')}
              className="btn-secondary"
              style={{ fontSize: '0.88rem', padding: '10px 20px' }}
            >
              <Calendar size={16} />
              Book Class
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '14px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'workouts', label: `Saved AI Workouts (${savedWorkouts.length})`, icon: Dumbbell },
            { id: 'meals', label: `Saved Meal Matrices (${savedMeals.length})`, icon: Utensils },
            { id: 'bookings', label: `Class Reservations (${bookings.length})`, icon: Calendar },
            { id: 'settings', label: 'Biometrics & Telemetry', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: isActive ? 'var(--neon-lime)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Saved Workouts */}
        {activeTab === 'workouts' && (
          <div>
            {savedWorkouts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {savedWorkouts.map((w) => (
                  <div key={w.id} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span className="badge-lime">{w.split_type}</span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '6px' }}>{w.title}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Saved on {w.created_at}</div>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '18px', lineHeight: 1.5 }}>
                      {w.routine_data?.overview?.slice(0, 140)}...
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--neon-cyan)' }}>
                        {w.days_per_week} Days / Week
                      </span>
                      <button
                        onClick={() => onNavigate('ai-studio')}
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                      >
                        View in Studio <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                <Dumbbell size={42} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
                <h3>No AI workout routines saved yet</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
                  Open the GenAI Studio to generate and save your custom protocol!
                </p>
                <button onClick={() => onNavigate('ai-studio')} className="btn-primary">
                  Launch GenAI Studio
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Meal Plans */}
        {activeTab === 'meals' && (
          <div>
            {savedMeals.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {savedMeals.map((m) => (
                  <div key={m.id} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span className="badge-cyan">{m.diet_type}</span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '6px' }}>{m.title}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Saved on {m.created_at}</div>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--neon-lime)' }}>
                        {m.daily_calories} kcal
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)', margin: '14px 0' }}>
                      <span>Protein: <strong style={{ color: '#fff' }}>{m.macros?.protein_g}g</strong></span>
                      <span>Carbs: <strong style={{ color: '#fff' }}>{m.macros?.carbs_g}g</strong></span>
                      <span>Fats: <strong style={{ color: '#fff' }}>{m.macros?.fat_g}g</strong></span>
                    </div>

                    <button
                      onClick={() => onNavigate('ai-studio')}
                      className="btn-secondary"
                      style={{ width: '100%', padding: '8px', fontSize: '0.82rem' }}
                    >
                      View Full Matrix in Studio
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                <Utensils size={42} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
                <h3>No nutritional meal plans saved yet</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
                  Generate custom athletic recipes and caloric targets in the GenAI Studio.
                </p>
                <button onClick={() => onNavigate('ai-studio')} className="btn-cyan">
                  Calculate Nutrition Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Class Reservations */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {bookings.map((b) => (
                  <div key={b.id} className="glass-panel" style={{
                    padding: '20px 24px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                          {b.schedule?.gym_class?.title}
                        </h4>
                        <span className="badge-lime">{b.status}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Date: <strong style={{ color: '#fff' }}>{b.booking_date}</strong> &bull; Time: {b.schedule?.start_time} - {b.schedule?.end_time} &bull; Room: {b.schedule?.room}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="btn-secondary"
                      style={{ color: 'var(--neon-coral)', borderColor: 'rgba(255, 51, 102, 0.3)', padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      <Trash2 size={15} />
                      Cancel Spot
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                <Calendar size={42} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
                <h3>No upcoming class reservations</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
                  Check out the group class timetable and claim your spot today!
                </p>
                <button onClick={() => onNavigate('classes')} className="btn-primary">
                  Browse Timetable
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Settings & Biometrics */}
        {activeTab === 'settings' && (
          <div className="glass-panel" style={{ maxWidth: '640px', margin: '0 auto', padding: '32px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
              Athlete Biometric Telemetry
            </h3>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={targetWeightKg}
                    onChange={(e) => setTargetWeightKg(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Fitness Goal
                </label>
                <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)} className="input-field">
                  <option value="hypertrophy">Muscle Building & Hypertrophy</option>
                  <option value="strength">Raw Strength & Power</option>
                  <option value="weight_loss">Weight Loss & Toning</option>
                  <option value="endurance">Cardio & Stamina</option>
                  <option value="general">Longevity & General Health</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Google Gemini AI API Key (Optional)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    placeholder="Enter your private Google Gemini API key"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Leave blank to use the built-in sports science AI engine.
                </div>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
              >
                {savingSettings ? 'Saving Telemetry...' : 'Update Athlete Profile'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
