// src/components/FlightCard.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function FlightCard({ flight, onBooked, index = 0 }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handleBook = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/bookings', { flightId: flight._id, numberOfSeats: seats });
      setSuccess(`Booked ${seats} seat(s) — $${(flight.price * seats).toFixed(2)}`);
      setExpanded(false);
      if (onBooked) onBooked();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const seatsLow = flight.availableSeats > 0 && flight.availableSeats < 10;
  const soldOut = flight.availableSeats === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flight-card"
    >
      {/* ── Top bar: flight number + price ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1.1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, rgba(30,79,216,0.3), rgba(59,130,246,0.2))',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', color: '#60a5fa',
            flexShrink: 0,
          }}>
            ✈
          </div>
          <div>
            <p style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#64748b',
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              {flight.flightNumber}
            </p>
            <p style={{
              fontSize: '0.72rem',
              color: seatsLow ? '#f59e0b' : soldOut ? '#ef4444' : '#34d399',
              fontWeight: 600,
              margin: '2px 0 0',
            }}>
              {soldOut ? '⊗ Fully booked' : seatsLow ? `⚡ Only ${flight.availableSeats} left` : `✓ ${flight.availableSeats} seats`}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'white',
            lineHeight: 1,
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            ${flight.price}
          </p>
          <p style={{ fontSize: '0.7rem', color: '#475569', margin: '2px 0 0' }}>per seat</p>
        </div>
      </div>

      {/* ── Route ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '1rem 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '1rem',
      }}>
        {/* From */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            color: 'white',
            margin: 0,
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {flight.from}
          </p>
          <p style={{ fontSize: '0.7rem', color: '#475569', margin: '2px 0 0', fontWeight: 500 }}>
            Departure
          </p>
        </div>

        {/* Connector */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
          flex: '0 0 auto',
        }}>
          <div style={{
            width: '60px', height: '1px',
            background: 'linear-gradient(90deg, rgba(59,130,246,0.3), rgba(59,130,246,0.7), rgba(59,130,246,0.3))',
          }} />
          <div style={{
            width: '22px', height: '22px',
            borderRadius: '50%',
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', color: '#60a5fa',
          }}>
            ›
          </div>
          <div style={{
            width: '60px', height: '1px',
            background: 'linear-gradient(90deg, rgba(59,130,246,0.3), rgba(59,130,246,0.7), rgba(59,130,246,0.3))',
          }} />
        </div>

        {/* To */}
        <div style={{ flex: 1, textAlign: 'right' }}>
          <p style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            color: 'white',
            margin: 0,
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {flight.to}
          </p>
          <p style={{ fontSize: '0.7rem', color: '#475569', margin: '2px 0 0', fontWeight: 500 }}>
            Arrival
          </p>
        </div>
      </div>

      {/* ── Date row ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        marginBottom: '1rem',
      }}>
        <span style={{ fontSize: '0.7rem', color: '#475569' }}>🗓</span>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
          {formatDate(flight.date)}
        </span>
      </div>

      {/* ── Success message ── */}
      {success && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(6,78,59,0.35)',
            border: '1px solid rgba(52,211,153,0.25)',
            color: '#34d399',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          ✓ {success}
        </motion.div>
      )}

      {/* ── Book button / seat selector ── */}
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="seat-selector"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            {error && (
              <div style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(127,29,29,0.3)',
                border: '1px solid rgba(248,113,113,0.2)',
                color: '#f87171',
                fontSize: '0.8rem',
                marginBottom: '10px',
              }}>
                {error}
              </div>
            )}
            <label style={{
              display: 'block',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '8px',
            }}>
              Number of seats
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="number"
                min="1"
                max={flight.availableSeats}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="input-field"
                style={{ textAlign: 'center', width: '90px' }}
              />
              <div style={{
                flex: 1,
                background: 'rgba(5,13,26,0.7)',
                border: '1.5px solid rgba(51,65,85,0.7)',
                borderRadius: '10px',
                padding: '0 14px',
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{ color: '#475569', fontSize: '0.82rem' }}>Total: </span>
                <span style={{ color: 'white', fontWeight: 800, marginLeft: '8px', fontSize: '1rem' }}>
                  ${(flight.price * seats).toFixed(2)}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setExpanded(false); setError(''); }}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleBook}
                disabled={loading || seats < 1 || seats > flight.availableSeats}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="book-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => { setSuccess(''); setExpanded(true); }}
            disabled={soldOut}
            className="btn-primary"
            style={{ opacity: soldOut ? 0.4 : 1, cursor: soldOut ? 'not-allowed' : 'pointer' }}
          >
            {soldOut ? '✗ Fully Booked' : '→ Book This Flight'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}