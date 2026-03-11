// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import FlightCard from '../components/FlightCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [form, setForm] = useState({ from: '', to: '', date: '' });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadAllFlights(); }, []);

  const loadAllFlights = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/flights');
      setFlights(data.flights);
    } catch {
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (form.from) params.append('from', form.from);
      if (form.to) params.append('to', form.to);
      if (form.date) params.append('date', form.date);
      const { data } = await api.get(`/flights/search?${params.toString()}`);
      setFlights(data.flights);
    } catch (err) {
      if (err.response?.status === 404) {
        setFlights([]);
        setError('No flights found matching your search criteria.');
      } else {
        setError('Search failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ from: '', to: '', date: '' });
    setSearched(false);
    setError('');
    loadAllFlights();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a' }}>

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <div className="hero-section" style={{ paddingTop: '64px' }}>

        {/* Floating plane silhouette (decorative) */}
        <div style={{
          position: 'absolute',
          right: '8%',
          top: '50%',
          transform: 'translateY(-55%) rotate(-12deg)',
          fontSize: 'clamp(100px, 18vw, 220px)',
          opacity: 0.04,
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 1,
        }}>
          ✈
        </div>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            padding: '2rem 1rem 0',
            maxWidth: '720px',
          }}
        >
          {/* Eyebrow tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: '999px',
            padding: '5px 14px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#93c5fd',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
            Flight Search & Booking
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 0 1rem',
          }}>
            The Sky Is{' '}
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #3b82f6, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Waiting
            </span>{' '}
            For You
          </h1>

          <p style={{
            color: '#64748b',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            margin: '0 0 2.5rem',
          }}>
            Search and book flights to hundreds of destinations worldwide.
            Fast, secure, and hassle-free.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '2.5rem',
          }}>
            {[
              { icon: '✈', label: 'Available Routes' },
              { icon: '🌍', label: 'Destinations' },
              { icon: '🔒', label: 'Secure Booking' },
            ].map((s) => (
              <div key={s.label} className="stat-pill">
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Search Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '860px',
            padding: '0 1rem 3rem',
          }}
        >
          <div className="search-card">
            {/* Card header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '1.5rem',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: '32px', height: '32px',
                background: 'linear-gradient(135deg, #1e4fd8, #3b82f6)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px',
              }}>
                ✈
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>
                  Search Flights
                </p>
                <p style={{ color: '#475569', fontSize: '0.75rem', margin: 0 }}>
                  Find the best routes for your journey
                </p>
              </div>
            </div>

            <form onSubmit={handleSearch}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '6px',
                  }}>
                    📍 From
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={form.from}
                    onChange={handleChange}
                    placeholder="Departure city"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '6px',
                  }}>
                    🎯 To
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={form.to}
                    onChange={handleChange}
                    placeholder="Destination city"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '6px',
                  }}>
                    📅 Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="input-field"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button type="submit" className="btn-search" style={{ flex: '0 0 auto' }}>
                  🔍 Search Flights
                </button>
                {searched && (
                  <button type="button" onClick={handleReset} className="btn-secondary">
                    ✕ Clear
                  </button>
                )}
                {!loading && flights.length > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.8rem',
                    color: '#475569',
                  }}>
                    <span style={{ color: '#3b82f6', fontWeight: 700 }}>{flights.length}</span>{' '}
                    flight{flights.length !== 1 ? 's' : ''} {searched ? 'found' : 'available'}
                  </span>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          RESULTS SECTION
      ══════════════════════════════════════ */}
      <div className="bg-grid" style={{ padding: '3rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* Loading */}
          {loading && <LoadingSpinner size="lg" />}

          {/* Error / empty state */}
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '5rem 1rem' }}
            >
              <div style={{
                fontSize: '3.5rem', marginBottom: '1rem',
                filter: 'grayscale(0.3)',
              }}>
                🔍
              </div>
              <h3 style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
                No Flights Found
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {error}
              </p>
              <button onClick={handleReset} className="btn-secondary" style={{ margin: '0 auto' }}>
                Show All Flights
              </button>
            </motion.div>
          )}

          {/* Section label */}
          {!loading && !error && flights.length > 0 && (
            <div className="section-label" style={{ marginBottom: '1.5rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
              }}>
                {searched ? 'Search Results' : 'Available Flights'}
              </span>
            </div>
          )}

          {/* Flight Grid */}
          {!loading && !error && (
            <AnimatePresence>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.25rem',
              }}>
                {flights.map((flight, i) => (
                  <FlightCard
                    key={flight._id}
                    flight={flight}
                    onBooked={loadAllFlights}
                    index={i}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}

          {/* Empty (no error, no flights) */}
          {!loading && !error && flights.length === 0 && !searched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '5rem 1rem', color: '#475569' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
              <p style={{ fontSize: '1rem' }}>No flights available right now.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}