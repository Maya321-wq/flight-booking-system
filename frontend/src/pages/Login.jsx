// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
      {/* Background elements */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(30,79,216,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

      {/* Decorative plane */}
      <div style={{
        position: 'absolute',
        right: '5%', top: '20%',
        fontSize: '180px',
        opacity: 0.025,
        transform: 'rotate(-20deg)',
        pointerEvents: 'none',
        userSelect: 'none',
        lineHeight: 1,
      }}>
        ✈
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}
      >
        {/* Left accent bar at top */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, #1e4fd8, #3b82f6, transparent)',
          borderRadius: '999px 999px 0 0',
        }} />

        <div className="auth-card" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none' }}>
          {/* Logo + heading */}
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
              Welcome Back
            </h1>
            <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>
              Sign in to your SkyBook account
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
                  placeholder="Your password"
                  required
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
              {loading ? 'Signing In...' : '→ Sign In'}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
          }}>
            <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#60a5fa', fontWeight: 700, textDecoration: 'none' }}>
                Create account →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}