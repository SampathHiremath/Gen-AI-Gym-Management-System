import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Dumbbell, Utensils, MessageSquare, Compass, Activity, 
  Save, Download, Check, RefreshCw, Send, Zap, ChevronDown, ChevronUp, 
  AlertCircle, ShieldCheck, HelpCircle, Key
} from 'lucide-react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import confetti from 'canvas-confetti';

export default function AIStudioPage() {
  const { user, geminiKey, setGeminiKey } = useAuth();
  const { showSuccess, showError, showInfo } = useNotification();
  
  const [activeTab, setActiveTab] = useState('workout'); // workout, nutrition, coach, form, readiness

  // ==================== TAB 1: WORKOUT GENERATOR STATE ====================
  const [wGoal, setWGoal] = useState('hypertrophy');
  const [wSplit, setWSplit] = useState('upper_lower');
  const [wDays, setWDays] = useState(4);
  const [wLevel, setWLevel] = useState('intermediate');
  const [wEquipment, setWEquipment] = useState('commercial_gym');
  const [wTargetMuscles, setWTargetMuscles] = useState('');
  const [wLimitations, setWLimitations] = useState('');
  const [wLoading, setWLoading] = useState(false);
  const [routine, setRoutine] = useState(null);
  const [expandedDay, setExpandedDay] = useState(1);
  const [savingWorkout, setSavingWorkout] = useState(false);

  // ==================== TAB 2: NUTRITION MATRIX STATE ====================
  const [nAge, setNAge] = useState(user?.profile?.age || 26);
  const [nGender, setNGender] = useState(user?.profile?.gender || 'male');
  const [nWeight, setNWeight] = useState(user?.profile?.weight_kg || 78);
  const [nHeight, setNHeight] = useState(user?.profile?.height_cm || 178);
  const [nActivity, setNActivity] = useState('moderate');
  const [nGoal, setNGoal] = useState(user?.profile?.fitness_goal || 'hypertrophy');
  const [nDietType, setNDietType] = useState(user?.profile?.dietary_preference || 'high_protein');
  const [nLoading, setNLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [savingMeal, setSavingMeal] = useState(false);

  // ==================== TAB 3: COACH CHAT STATE ====================
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello Athlete! I am **PulseCoach AI**, your dedicated 24/7 fitness science and nutrition advisor. Ask me anything about lifting technique, training splits, macronutrients, supplements, or breaking through plateaus."
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // ==================== TAB 4: FORM ADVISOR STATE ====================
  const [selectedExercise, setSelectedExercise] = useState('squat');
  const [formGuide, setFormGuide] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // ==================== TAB 5: READINESS STATE ====================
  const [rSleep, setRSleep] = useState(7.5);
  const [rSoreness, setRSoreness] = useState(2);
  const [rStress, setRStress] = useState(2);
  const [rEnergy, setREnergy] = useState(4);
  const [readinessResult, setReadinessResult] = useState(null);
  const [readinessLoading, setReadinessLoading] = useState(false);

  // Pre-load default workout and nutrition on mount
  useEffect(() => {
    handleGenerateWorkout();
    handleGenerateMealPlan();
    loadFormGuide('squat');
    handleCalculateReadiness();
  }, []);

  // 1. WORKOUT HANDLERS
  const handleGenerateWorkout = async () => {
    setWLoading(true);
    try {
      const res = await api.generateWorkout({
        goal: wGoal,
        split: wSplit,
        days_per_week: wDays,
        fitness_level: wLevel,
        equipment: wEquipment,
        target_muscles: wTargetMuscles,
        limitations: wLimitations,
        api_key: geminiKey
      });
      setRoutine(res.routine);
      setExpandedDay(1);
      showSuccess(`Synthesized ${res.routine.title} via ${res.generated_by}!`);
    } catch (err) {
      showError(err.message || 'Failed to generate workout');
    } finally {
      setWLoading(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!routine) return;
    setSavingWorkout(true);
    try {
      await api.saveWorkout({
        user_id: user?.id,
        title: routine.title,
        goal: wGoal,
        split: wSplit,
        days_per_week: wDays,
        routine: routine
      });
      showSuccess('Workout protocol saved to your athlete profile!');
      confetti({ particleCount: 60, spread: 60 });
    } catch (err) {
      showError(err.message || 'Failed to save workout');
    } finally {
      setSavingWorkout(false);
    }
  };

  // 2. NUTRITION HANDLERS
  const handleGenerateMealPlan = async () => {
    setNLoading(true);
    try {
      const res = await api.generateMealPlan({
        age: nAge,
        gender: nGender,
        weight_kg: nWeight,
        height_cm: nHeight,
        activity: nActivity,
        goal: nGoal,
        diet_type: nDietType,
        api_key: geminiKey
      });
      setMealPlan(res.meal_plan);
      showSuccess('Macro matrix and daily meal plan synthesized!');
    } catch (err) {
      showError(err.message || 'Failed to calculate nutrition');
    } finally {
      setNLoading(false);
    }
  };

  const handleSaveMealPlan = async () => {
    if (!mealPlan) return;
    setSavingMeal(true);
    try {
      await api.saveMealPlan({
        user_id: user?.id,
        title: mealPlan.title,
        daily_calories: mealPlan.daily_calories,
        diet_type: nDietType,
        macros: mealPlan.macros,
        meal_plan: mealPlan
      });
      showSuccess('Meal matrix saved to your athlete profile!');
      confetti({ particleCount: 60, spread: 60 });
    } catch (err) {
      showError(err.message || 'Failed to save meal plan');
    } finally {
      setSavingMeal(false);
    }
  };

  // 3. COACH CHAT HANDLERS
  const handleSendChat = async (messageToSend) => {
    const text = messageToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.sendChatMessage({
        message: text,
        user_id: user?.id,
        session_id: user ? `user_${user.id}_session` : 'guest_session',
        api_key: geminiKey
      });

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.reply
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      showError('Coach communication error');
    } finally {
      setChatLoading(false);
    }
  };

  // 4. FORM GUIDE HANDLERS
  const loadFormGuide = async (exerciseKey) => {
    setSelectedExercise(exerciseKey);
    setFormLoading(true);
    try {
      const res = await api.getFormGuide(exerciseKey);
      setFormGuide(res);
    } catch (err) {
      showError('Could not load exercise form guide');
    } finally {
      setFormLoading(false);
    }
  };

  // 5. READINESS HANDLERS
  const handleCalculateReadiness = async () => {
    setReadinessLoading(true);
    try {
      const res = await api.getReadinessScore({
        sleep_hours: rSleep,
        soreness: rSoreness,
        stress: rStress,
        energy: rEnergy
      });
      setReadinessResult(res);
    } catch (err) {
      showError('Could not calculate readiness score');
    } finally {
      setReadinessLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(204, 255, 0, 0.1)',
            border: '1px solid rgba(204, 255, 0, 0.3)',
            marginBottom: '16px'
          }}>
            <Sparkles size={16} color="var(--neon-lime)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--neon-lime)', textTransform: 'uppercase' }}>
              Generative AI Athletic Suite
            </span>
          </div>
          <h1 className="section-title">
            PULSE <span className="gradient-text-lime">GENAI STUDIO</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Harness scientific exercise programming, metabolic macronutrient calculators, and our 24/7 AI biomechanics coach.
          </p>

          {/* Optional Gemini API Key Banner */}
          <div style={{
            marginTop: '20px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.85rem'
          }}>
            <Key size={16} color="var(--neon-cyan)" />
            <span style={{ color: 'var(--text-muted)' }}>
              {geminiKey ? 'Using Custom Gemini API Key' : 'Using Built-in Titan Sports Science Engine (Optional: Add Gemini Key)'}
            </span>
            <input
              type="password"
              placeholder="Paste Gemini API key (optional)"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              style={{
                background: '#070a10',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.78rem',
                width: '180px'
              }}
            />
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '36px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '16px'
        }}>
          {[
            { id: 'workout', label: 'Workout Generator', icon: Dumbbell, color: 'var(--neon-lime)' },
            { id: 'nutrition', label: 'Nutrition & Macros', icon: Utensils, color: 'var(--neon-cyan)' },
            { id: 'coach', label: 'PulseCoach 24/7', icon: MessageSquare, color: 'var(--neon-coral)' },
            { id: 'form', label: 'Form & Cues', icon: Compass, color: 'var(--neon-lime)' },
            { id: 'readiness', label: 'Daily Readiness', icon: Activity, color: 'var(--neon-cyan)' },
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
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isActive ? tab.color : 'rgba(255, 255, 255, 0.06)'}`,
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.92rem',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={18} color={isActive ? tab.color : 'currentColor'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: WORKOUT GENERATOR */}
        {/* ========================================================================= */}
        {activeTab === 'workout' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
            {/* Control Panel */}
            <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-md)', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Dumbbell size={20} color="var(--neon-lime)" />
                Workout Parameters
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Primary Training Objective
                  </label>
                  <select value={wGoal} onChange={(e) => setWGoal(e.target.value)} className="input-field">
                    <option value="hypertrophy">Muscle Hypertrophy (Density & Size)</option>
                    <option value="strength">Raw Strength (Heavy Barbell Power)</option>
                    <option value="weight_loss">Metabolic Fat Loss & Conditioning</option>
                    <option value="endurance">Muscular Endurance & Stamina</option>
                    <option value="general">Athletic Longevity & Joint Health</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Training Split
                    </label>
                    <select value={wSplit} onChange={(e) => setWSplit(e.target.value)} className="input-field">
                      <option value="upper_lower">Upper / Lower</option>
                      <option value="ppl">Push / Pull / Legs</option>
                      <option value="full_body">Full Body</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Days Per Week
                    </label>
                    <select value={wDays} onChange={(e) => setWDays(Number(e.target.value))} className="input-field">
                      <option value={3}>3 Days</option>
                      <option value={4}>4 Days</option>
                      <option value={5}>5 Days</option>
                      <option value={6}>6 Days</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Experience Level
                    </label>
                    <select value={wLevel} onChange={(e) => setWLevel(e.target.value)} className="input-field">
                      <option value="beginner">Beginner (&lt;1 yr)</option>
                      <option value="intermediate">Intermediate (1-3 yrs)</option>
                      <option value="advanced">Advanced (3+ yrs)</option>
                      <option value="athlete">Elite Athlete</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Equipment Available
                    </label>
                    <select value={wEquipment} onChange={(e) => setWEquipment(e.target.value)} className="input-field">
                      <option value="commercial_gym">Commercial Gym</option>
                      <option value="dumbbells_only">Home Dumbbells Only</option>
                      <option value="bodyweight">Bodyweight / Calisthenics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Target Muscles (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Upper Chest, Rear Delts, Hamstrings"
                    value={wTargetMuscles}
                    onChange={(e) => setWTargetMuscles(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Injuries or Limitations (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lower back stiffness, no heavy overhead presses"
                    value={wLimitations}
                    onChange={(e) => setWLimitations(e.target.value)}
                    className="input-field"
                  />
                </div>

                <button
                  onClick={handleGenerateWorkout}
                  disabled={wLoading}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {wLoading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" /> Synthesizing AI Protocol...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} /> Generate AI Workout Protocol
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Routine Display */}
            <div>
              {routine ? (
                <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge-lime">{routine.goal}</span>
                        <span className="badge-cyan">{routine.days_per_week} Days / Week</span>
                      </div>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>
                        {routine.title}
                      </h2>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={handleSaveWorkout}
                        disabled={savingWorkout}
                        className="btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                      >
                        <Save size={15} />
                        {savingWorkout ? 'Saving...' : 'Save to Profile'}
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                      >
                        <Download size={15} /> Print
                      </button>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.6 }}>
                    {routine.overview}
                  </p>

                  {/* Day Navigation Tabs */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {routine.weekly_schedule?.map((day) => (
                      <button
                        key={day.day_number}
                        onClick={() => setExpandedDay(day.day_number)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          background: expandedDay === day.day_number ? 'var(--neon-lime)' : 'rgba(255, 255, 255, 0.05)',
                          color: expandedDay === day.day_number ? '#000' : 'var(--text-muted)',
                          transition: 'var(--transition)'
                        }}
                      >
                        Day {day.day_number}: {day.title.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Active Day Detail */}
                  {routine.weekly_schedule?.filter((d) => d.day_number === expandedDay).map((day) => (
                    <div key={day.day_number} style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                          Day {day.day_number}: {day.title}
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--neon-cyan)' }}>
                          Target Focus: {day.target_focus}
                        </div>
                      </div>

                      {/* Warmup */}
                      <div style={{
                        background: 'rgba(0, 240, 255, 0.05)',
                        borderLeft: '3px solid var(--neon-cyan)',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        marginBottom: '16px'
                      }}>
                        <strong style={{ color: 'var(--neon-cyan)' }}>Warm-Up Protocol: </strong>
                        {day.warmup}
                      </div>

                      {/* Exercises Table */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {day.exercises?.map((ex, exIdx) => (
                          <div key={exIdx} style={{
                            background: '#0d111b',
                            borderRadius: '8px',
                            padding: '14px 18px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                          }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fff' }}>
                                {ex.name}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {ex.notes}
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', textAlign: 'right' }}>
                              <div>
                                <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Sets x Reps</div>
                                <div style={{ fontWeight: 800, color: 'var(--neon-lime)' }}>{ex.sets} &times; {ex.reps}</div>
                              </div>
                              <div>
                                <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Rest</div>
                                <div style={{ fontWeight: 600 }}>{ex.rest}</div>
                              </div>
                              <div>
                                <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem', textTransform: 'uppercase' }}>RPE</div>
                                <div style={{ fontWeight: 600, color: 'var(--neon-cyan)' }}>{ex.rpe}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cooldown */}
                      <div style={{
                        background: 'rgba(204, 255, 0, 0.05)',
                        borderLeft: '3px solid var(--neon-lime)',
                        padding: '10px 14px',
                        fontSize: '0.85rem'
                      }}>
                        <strong style={{ color: 'var(--neon-lime)' }}>Cool-Down & Mobility: </strong>
                        {day.cooldown}
                      </div>
                    </div>
                  ))}

                  {/* Coach Rules Footer */}
                  {routine.coach_rules && (
                    <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--neon-lime)', marginBottom: '8px' }}>
                        Titan Coach Execution Rules:
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                        {routine.coach_rules.map((rule, idx) => (
                          <li key={idx} style={{ display: 'flex', gap: '8px' }}>
                            <Check size={16} color="var(--neon-lime)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                  <Dumbbell size={48} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
                  <h3>Configure parameters to build your AI workout plan</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: NUTRITION & MACROS */}
        {/* ========================================================================= */}
        {activeTab === 'nutrition' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
            {/* Biometric Calculator Inputs */}
            <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-md)', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Utensils size={20} color="var(--neon-cyan)" />
                Biometric Caloric Calculator
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Age
                    </label>
                    <input
                      type="number"
                      value={nAge}
                      onChange={(e) => setNAge(Number(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Gender
                    </label>
                    <select value={nGender} onChange={(e) => setNGender(e.target.value)} className="input-field">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={nWeight}
                      onChange={(e) => setNWeight(Number(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={nHeight}
                      onChange={(e) => setNHeight(Number(e.target.value))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Activity Multiplier
                  </label>
                  <select value={nActivity} onChange={(e) => setNActivity(e.target.value)} className="input-field">
                    <option value="sedentary">Sedentary (Desk job, little exercise)</option>
                    <option value="light">Light (Exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
                    <option value="very_active">Very Active (Heavy training 6-7 days)</option>
                    <option value="athlete">Elite Athlete (2x training/day)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Diet Preference
                    </label>
                    <select value={nDietType} onChange={(e) => setNDietType(e.target.value)} className="input-field">
                      <option value="high_protein">High Protein Athletic</option>
                      <option value="keto">Ketogenic (Low Carb)</option>
                      <option value="vegan">Plant-Based Vegan</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Body Goal
                    </label>
                    <select value={nGoal} onChange={(e) => setNGoal(e.target.value)} className="input-field">
                      <option value="hypertrophy">Muscle Gain (Surplus)</option>
                      <option value="weight_loss">Fat Shred (Deficit)</option>
                      <option value="strength">Strength Recomp</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateMealPlan}
                  disabled={nLoading}
                  className="btn-cyan"
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  {nLoading ? 'Calculating Macro Matrix...' : 'Synthesize Nutrition Matrix'}
                </button>
              </div>
            </div>

            {/* Generated Meal Matrix Display */}
            <div>
              {mealPlan ? (
                <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                    <div>
                      <span className="badge-cyan">{nDietType.replace('_', ' ')}</span>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '4px' }}>
                        {mealPlan.title}
                      </h2>
                    </div>

                    <button
                      onClick={handleSaveMealPlan}
                      disabled={savingMeal}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    >
                      <Save size={15} />
                      {savingMeal ? 'Saving...' : 'Save Matrix'}
                    </button>
                  </div>

                  {/* Calories & Macro Summary Cards */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '12px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ background: '#0e1320', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Calories</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--neon-lime)' }}>{mealPlan.daily_calories}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>TDEE: {mealPlan.tdee} kcal</div>
                    </div>

                    <div style={{ background: '#0e1320', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Protein</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>{mealPlan.macros?.protein_g}g</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{mealPlan.macros?.protein_pct}% of total</div>
                    </div>

                    <div style={{ background: '#0e1320', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Carbs</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fbbf24' }}>{mealPlan.macros?.carbs_g}g</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{mealPlan.macros?.carbs_pct}% of total</div>
                    </div>

                    <div style={{ background: '#0e1320', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Healthy Fats</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--neon-coral)' }}>{mealPlan.macros?.fat_g}g</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{mealPlan.macros?.fat_pct}% of total</div>
                    </div>
                  </div>

                  {/* Meals Breakdown */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px' }}>
                    Daily Meal Matrix
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {mealPlan.meals?.map((meal, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{meal.meal_name}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '10px' }}>({meal.timing})</span>
                          </div>
                          <span style={{ fontWeight: 800, color: 'var(--neon-lime)' }}>{meal.calories} kcal</span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                          <span>Protein: <strong style={{ color: '#fff' }}>{meal.protein}g</strong></span>
                          <span>Carbs: <strong style={{ color: '#fff' }}>{meal.carbs}g</strong></span>
                          <span>Fat: <strong style={{ color: '#fff' }}>{meal.fat}g</strong></span>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
                          <strong>Ingredients:</strong> {meal.foods?.join(', ')}
                        </div>

                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                          Chef Note: {meal.recipe_tip}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grocery List */}
                  {mealPlan.grocery_list && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ fontWeight: 700, color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                        Curated Grocery Basket:
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-muted)' }}>
                        {mealPlan.grocery_list.map((item, idx) => (
                          <li key={idx}>&bull; {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PULSECOACH AI CHAT */}
        {/* ========================================================================= */}
        {activeTab === 'coach' && (
          <div className="glass-panel" style={{
            maxWidth: '900px',
            margin: '0 auto',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '700px'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#0d111a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ff3366 0%, #ccff00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(255, 51, 102, 0.4)'
                }}>
                  <Zap size={22} color="#000" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>PulseCoach AI</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--neon-lime)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-lime)', display: 'inline-block' }} />
                    Online &bull; Exercise Science Engine Active
                  </div>
                </div>
              </div>

              <span className="badge-coral">24/7 Agent</span>
            </div>

            {/* Chat Quick Chips */}
            <div style={{
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}>
              {[
                'Optimal creatine timing?',
                'How to break bench plateau?',
                'Best pre-workout meal?',
                'How to recover from severe DOMS?',
                'What are gym hours?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(chip)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'var(--transition)'
                  }}
                  onMouseOver={(e) => (e.target.style.borderColor = 'var(--neon-lime)')}
                  onMouseOut={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages List */}
            <div style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {chatMessages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-dim)',
                      alignSelf: isAssistant ? 'flex-start' : 'flex-end'
                    }}>
                      {isAssistant ? 'PulseCoach AI' : (user?.first_name || 'You')}
                    </div>
                    <div style={{
                      padding: '14px 18px',
                      borderRadius: isAssistant ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                      background: isAssistant ? '#131926' : 'var(--neon-lime)',
                      color: isAssistant ? '#e2e8f0' : '#000',
                      border: isAssistant ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-line'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              {chatLoading && (
                <div style={{ alignSelf: 'flex-start', color: 'var(--text-dim)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={14} className="animate-spin" /> PulseCoach is analyzing sports science principles...
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
              style={{
                padding: '16px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: '#0d111a',
                display: 'flex',
                gap: '12px'
              }}
            >
              <input
                type="text"
                placeholder="Ask about exercises, creatine, macros, splits..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="input-field"
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="btn-primary"
                style={{ padding: '0 20px' }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: BIOMECHANICAL FORM ADVISOR */}
        {/* ========================================================================= */}
        {activeTab === 'form' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
                Biomechanical Exercise Form & Cue Advisor
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Select any fundamental compound movement for setup cues, execution checklists, and fatal errors to avoid.
              </p>
            </div>

            {/* Exercise Selector Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
              {[
                { key: 'squat', name: 'Barbell Back Squat' },
                { key: 'deadlift', name: 'Conventional Deadlift' },
                { key: 'bench_press', name: 'Flat Bench Press' },
                { key: 'overhead_press', name: 'Overhead Press (OHP)' },
                { key: 'pull_up', name: 'Strict Pull-Up' },
                { key: 'barbell_row', name: 'Bent-Over Barbell Row' },
              ].map((ex) => (
                <button
                  key={ex.key}
                  onClick={() => loadFormGuide(ex.key)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    background: selectedExercise === ex.key ? 'var(--neon-lime)' : 'rgba(255, 255, 255, 0.03)',
                    color: selectedExercise === ex.key ? '#000' : 'var(--text-muted)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'var(--transition)'
                  }}
                >
                  {ex.name}
                </button>
              ))}
            </div>

            {/* Form Guide Detail */}
            {formGuide && (
              <div className="glass-panel" style={{ maxWidth: '960px', margin: '0 auto', padding: '36px', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                  <div>
                    <span className="badge-lime">{formGuide.category}</span>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '6px' }}>
                      {formGuide.name}
                    </h2>
                  </div>
                  <span className="badge-cyan">Level: {formGuide.difficulty}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                  {/* Setup Cues */}
                  <div style={{ background: '#0e1320', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <h4 style={{ color: 'var(--neon-lime)', fontWeight: 800, marginBottom: '14px', fontSize: '1rem', textTransform: 'uppercase' }}>
                      1. Setup & Unrack Protocol
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      {formGuide.setup_cues?.map((cue, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ color: 'var(--neon-lime)', fontWeight: 800 }}>&bull;</span>
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Execution Steps */}
                  <div style={{ background: '#0e1320', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <h4 style={{ color: 'var(--neon-cyan)', fontWeight: 800, marginBottom: '14px', fontSize: '1rem', textTransform: 'uppercase' }}>
                      2. Neuromuscular Execution
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      {formGuide.execution_cues?.map((cue, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ color: 'var(--neon-cyan)', fontWeight: 800 }}>&bull;</span>
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Fatal Mistakes */}
                <div style={{
                  background: 'rgba(255, 51, 102, 0.05)',
                  border: '1px solid rgba(255, 51, 102, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  <h4 style={{ color: 'var(--neon-coral)', fontWeight: 800, marginBottom: '12px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={18} /> Common Fatal Mistakes to Avoid
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                    {formGuide.common_mistakes?.map((mistake, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--neon-coral)', fontWeight: 800 }}>&times;</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobility Warmup */}
                <div style={{
                  background: 'rgba(204, 255, 0, 0.05)',
                  border: '1px solid rgba(204, 255, 0, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '18px',
                  fontSize: '0.88rem'
                }}>
                  <strong style={{ color: 'var(--neon-lime)' }}>Mobilization Drill: </strong>
                  <span style={{ color: 'var(--text-muted)' }}>{formGuide.warmup_recommendation}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: DAILY CNS STRAIN & READINESS SCORE */}
        {/* ========================================================================= */}
        {activeTab === 'readiness' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <span className="badge-cyan" style={{ marginBottom: '10px' }}>CENTRAL NERVOUS SYSTEM RECOVERY</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>
                  Daily Training Readiness Calculator
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  Adjust your sleep and biofeedback markers to calculate today's recommended training volume and intensity.
                </p>
              </div>

              {/* Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginBottom: '32px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span>Sleep Duration (Hours):</span>
                    <strong style={{ color: 'var(--neon-lime)' }}>{rSleep} hrs</strong>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="11"
                    step="0.5"
                    value={rSleep}
                    onChange={(e) => setRSleep(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--neon-lime)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span>Muscle Soreness (1 = Fresh, 5 = Severe DOMS):</span>
                    <strong style={{ color: 'var(--neon-coral)' }}>Level {rSoreness} / 5</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={rSoreness}
                    onChange={(e) => setRSoreness(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--neon-coral)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span>Mental Stress & Fatigue (1 = Relaxed, 5 = High Stress):</span>
                    <strong style={{ color: '#fbbf24' }}>Level {rStress} / 5</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={rStress}
                    onChange={(e) => setRStress(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#fbbf24' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span>Energy & Motivation (1 = Exhausted, 5 = Ready to Destroy):</span>
                    <strong style={{ color: 'var(--neon-cyan)' }}>Level {rEnergy} / 5</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={rEnergy}
                    onChange={(e) => setREnergy(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--neon-cyan)' }}
                  />
                </div>

                <button
                  onClick={handleCalculateReadiness}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  Recalculate Today's Score
                </button>
              </div>

              {/* Readiness Output Card */}
              {readinessResult && (
                <div style={{
                  background: '#0a0d14',
                  borderRadius: 'var(--radius-md)',
                  padding: '28px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Bio-Readiness Score
                  </div>
                  <div style={{
                    fontSize: '4.5rem',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    color: readinessResult.readiness_score >= 80 ? 'var(--neon-lime)' : readinessResult.readiness_score >= 60 ? 'var(--neon-cyan)' : 'var(--neon-coral)',
                    textShadow: '0 0 30px rgba(204, 255, 0, 0.3)'
                  }}>
                    {readinessResult.readiness_score}
                    <span style={{ fontSize: '1.5rem', color: 'var(--text-dim)' }}>/100</span>
                  </div>

                  <div style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#fff',
                    marginBottom: '16px'
                  }}>
                    {readinessResult.category}
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
                    {readinessResult.recommendation}
                  </p>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.88rem'
                  }}>
                    <span>Target Intensity:</span>
                    <strong style={{ color: 'var(--neon-lime)' }}>{readinessResult.intensity_level}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
