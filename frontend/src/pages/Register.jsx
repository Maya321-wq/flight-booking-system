// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', form);
      localStorage.setItem('pendingEmail', form.email);
      navigate('/verify-email');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please check your connection and try again.');
      } else if (err.message === 'Network Error') {
        setError('Network error. Please check if the server is running.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050d1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5rem 1rem 2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(30,79,216,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

      {/* Decorative plane */}
      <div style={{
        position: 'absolute', left: '5%', bottom: '10%',
        fontSize: '160px', opacity: 0.025,
        transform: 'rotate(15deg)', pointerEvents: 'none', userSelect: 'none', lineHeight: 1,
      }}>
        ✈
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}
      >
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, #1e4fd8, #3b82f6, transparent)',
          borderRadius: '999px 999px 0 0',
        }} />

        <div className="auth-card" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '52px', height: '52px',
              background: 'linear-gradient(135deg, #1e4fd8, #3b82f6)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '22px',
              boxShadow: '0 8px 24px rgba(30,79,216,0.4)',
            }}>
              ✈
            </div>
            <h1 style={{
              color: 'white', fontSize: '1.5rem', fontWeight: 800,
              margin: '0 0 6px', letterSpacing: '-0.02em',
            }}>
              Create Account
            </h1>
            <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>
              Join SkyBook and start booking flights today
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{
                  display: 'block', fontSize: '0.72rem', fontWeight: 700,
                  color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ahmed Mohamed"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label style={{
                  display: 'block', fontSize: '0.72rem', fontWeight: 700,
                  color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label style={{
                  display: 'block', fontSize: '0.72rem', fontWeight: 700,
                  color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="input-field"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(127,29,29,0.35)',
                  border: '1px solid rgba(248,113,113,0.25)',
                  color: '#f87171',
                  fontSize: '0.82rem',
                  marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                ⚠ {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating Account...' : '→ Create Account'}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
          }}>
            <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#60a5fa', fontWeight: 700, textDecoration: 'none' }}>
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}