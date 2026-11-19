import React, { useState, useEffect } from 'react';
import { Check, Zap, Sparkles, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import confetti from 'canvas-confetti';

export default function PricingPage({ onOpenAuth, onNavigate }) {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [plans, setPlans] = useState([]);
  const [annualBilling, setAnnualBilling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await api.getPlans();
      setPlans(data);
    } catch (err) {
      showError('Failed to load membership plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (plan) => {
    if (!user) {
      onOpenAuth('login');
      return;
    }

    setSubscribingId(plan.id);
    try {
      const res = await api.subscribePlan({
        user_id: user.id,
        plan_id: plan.id,
        billing_cycle: annualBilling ? 'annual' : 'monthly'
      });
      showSuccess(res.message || `Welcome to ${plan.name}!`);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onNavigate('dashboard');
    } catch (err) {
      showError(err.message || 'Failed to enroll in plan');
    } finally {
      setSubscribingId(null);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px auto' }}>
          <span className="badge-lime" style={{ marginBottom: '14px' }}>TRANSPARENT VALUE</span>
          <h1 className="section-title">
            MEMBERSHIP TIERS & <span className="gradient-text-lime">AI PASSES</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '28px' }}>
            Choose the level of iron and intelligence that matches your physical ambition. Cancel or upgrade anytime with zero hidden fees.
          </p>

          {/* Billing Cycle Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 12px',
            borderRadius: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={() => setAnnualBilling(false)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '0.88rem',
                fontWeight: !annualBilling ? 700 : 500,
                background: !annualBilling ? 'var(--neon-lime)' : 'transparent',
                color: !annualBilling ? '#000' : 'var(--text-muted)',
                transition: 'var(--transition)'
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '0.88rem',
                fontWeight: annualBilling ? 700 : 500,
                background: annualBilling ? 'var(--neon-lime)' : 'transparent',
                color: annualBilling ? '#000' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'var(--transition)'
              }}
            >
              <span>Annual Billing</span>
              <span style={{
                background: '#ff3366',
                color: '#fff',
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 800
              }}>
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {plans.map((plan) => {
            const price = annualBilling 
              ? (Number(plan.price_annual) / 12).toFixed(2)
              : Number(plan.price_monthly).toFixed(2);

            return (
              <div
                key={plan.id}
                className="glass-panel"
                style={{
                  padding: '32px 28px',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  border: plan.is_popular ? '2px solid var(--neon-lime)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: plan.is_popular ? 'rgba(21, 27, 43, 0.9)' : 'var(--bg-glass)',
                  boxShadow: plan.is_popular ? '0 0 35px rgba(204, 255, 0, 0.2)' : 'none'
                }}
              >
                {/* Popular / VIP Badge */}
                {plan.badge_text && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: plan.is_popular ? 'var(--neon-lime)' : 'var(--neon-cyan)',
                    color: '#000',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    padding: '4px 14px',
                    borderRadius: '20px',
                    letterSpacing: '1px'
                  }}>
                    {plan.badge_text}
                  </div>
                )}

                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px' }}>
                    {plan.name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', minHeight: '40px', marginBottom: '20px' }}>
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.2rem', color: 'var(--neon-lime)', fontWeight: 800 }}>$</span>
                    <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{price}</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>/ month</span>
                  </div>

                  {annualBilling && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)', marginBottom: '16px' }}>
                      Billed annually at ${plan.price_annual}/yr
                    </div>
                  )}

                  {/* Features List */}
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Included Facilities & Perks
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                      {plan.features?.map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: '10px', color: '#cbd5e1' }}>
                          <Check size={16} color="var(--neon-lime)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* AI Features */}
                    {plan.ai_features?.length > 0 && (
                      <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={12} /> GenAI Capabilities
                        </div>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                          {plan.ai_features.map((aiFeat, idx) => (
                            <li key={idx} style={{ display: 'flex', gap: '8px', color: '#94a3b8' }}>
                              <Zap size={14} color="var(--neon-cyan)" style={{ flexShrink: 0, marginTop: '3px' }} />
                              <span>{aiFeat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enrollment Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={subscribingId === plan.id}
                  className={plan.is_popular ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  {subscribingId === plan.id ? 'Processing Enrollment...' : (
                    <>
                      <span>{user ? `Enroll in ${plan.name}` : 'Join Membership'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
