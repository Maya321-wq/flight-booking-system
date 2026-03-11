// src/pages/MyBookings.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/useAuth';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/bookings/my-bookings');
      setBookings(data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const canceled = bookings.filter((b) => b.status === 'canceled');

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a' }}>

      {/* ── Page header banner ── */}
      <div style={{
        background: 'linear-gradient(165deg, #0a1a3a 0%, #050d1a 60%)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '80px',
        paddingBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 80% at 50% -20%, rgba(30,79,216,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Decorative plane */}
        <div style={{
          position: 'absolute', right: '4%', top: '50%',
          transform: 'translateY(-50%) rotate(-15deg)',
          fontSize: '160px', opacity: 0.03,
          pointerEvents: 'none', userSelect: 'none', lineHeight: 1,
        }}>
          ✈
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: '0.7rem', fontWeight: 700,
              color: '#93c5fd',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
              Account
            </div>

            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 800,
              color: 'white',
              margin: '0 0 0.5rem',
              letterSpacing: '-0.03em',
            }}>
              My{' '}
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Bookings
              </span>
            </h1>

            <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 1.5rem' }}>
              Welcome back,{' '}
              <span style={{ color: '#94a3b8', fontWeight: 600 }}>{user?.name}</span>
            </p>

            {/* Summary stats */}
            {!loading && bookings.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div className="stat-pill">
                  <span style={{ color: '#34d399' }}>●</span>
                  <span>{confirmed.length} Active</span>
                </div>
                {canceled.length > 0 && (
                  <div className="stat-pill">
                    <span style={{ color: '#f87171' }}>●</span>
                    <span>{canceled.length} Canceled</span>
                  </div>
                )}
                <div className="stat-pill">
                  <span>✈</span>
                  <span>{bookings.length} Total</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="bg-grid" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Loading */}
          {loading && <LoadingSpinner size="lg" />}

          {/* Error */}
          {!loading && error && (
            <div style={{
              textAlign: 'center', padding: '4rem 1rem',
              color: '#f87171', fontSize: '0.95rem',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && bookings.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '5rem 1rem' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>✈️</div>
              <h2 style={{ color: '#94a3b8', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
                No Bookings Yet
              </h2>
              <p style={{ color: '#475569', fontSize: '0.875rem', margin: '0 0 1.5rem' }}>
                Search for available flights and book your first trip
              </p>
              <a href="/" style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #1e4fd8, #2563eb)',
                color: 'white', fontWeight: 700, fontSize: '0.875rem',
                padding: '10px 24px', borderRadius: '10px', textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(30,79,216,0.35)',
              }}>
                → Search Flights
              </a>
            </motion.div>
          )}

          {/* Confirmed Bookings */}
          {!loading && confirmed.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div className="section-label">
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, color: '#34d399',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 8px rgba(52,211,153,0.6)' }} />
                  Active Bookings ({confirmed.length})
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.1rem',
              }}>
                {confirmed.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onCanceled={fetchBookings}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Canceled Bookings */}
          {!loading && canceled.length > 0 && (
            <div>
              <div className="section-label">
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, color: '#475569',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#475569', display: 'inline-block' }} />
                  Canceled ({canceled.length})
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.1rem',
                opacity: 0.55,
              }}>
                {canceled.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}