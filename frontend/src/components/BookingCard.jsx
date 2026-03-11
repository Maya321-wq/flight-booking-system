// src/components/BookingCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';

export default function BookingCard({ booking, onCanceled }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });

  const formatFlightDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setLoading(true);
    setError('');
    try {
      await api.put(`/bookings/${booking._id}/cancel`);
      if (onCanceled) onCanceled();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.');
      setLoading(false);
    }
  };

  const flight = booking.flightId;
  const isConfirmed = booking.status === 'confirmed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="booking-card"
    >
      {/* ── Header: flight number + status ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', color: '#60a5fa',
            flexShrink: 0,
          }}>
            ✈
          </div>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.72rem',
            fontWeight: 500,
            color: '#64748b',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {flight?.flightNumber || 'N/A'}
          </span>
        </div>
        <span className={isConfirmed ? 'badge-confirmed' : 'badge-canceled'}>
          {isConfirmed ? '● ' : '○ '}{booking.status}
        </span>
      </div>

      {/* ── Route ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '0.9rem 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '1rem',
      }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '1.2rem', fontWeight: 800, color: 'white',
            margin: 0, letterSpacing: '-0.01em',
          }}>
            {flight?.from || '—'}
          </p>
          <p style={{ fontSize: '0.68rem', color: '#475569', margin: '2px 0 0', fontWeight: 500 }}>From</p>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
          flex: '0 0 auto',
        }}>
          <div style={{
            width: '40px', height: '1px',
            background: 'linear-gradient(90deg, rgba(59,130,246,0.3), rgba(59,130,246,0.6), rgba(59,130,246,0.3))',
          }} />
          <span style={{ color: '#3b82f6', fontSize: '14px' }}>→</span>
          <div style={{
            width: '40px', height: '1px',
            background: 'linear-gradient(90deg, rgba(59,130,246,0.3), rgba(59,130,246,0.6), rgba(59,130,246,0.3))',
          }} />
        </div>

        <div style={{ flex: 1, textAlign: 'right' }}>
          <p style={{
            fontSize: '1.2rem', fontWeight: 800, color: 'white',
            margin: 0, letterSpacing: '-0.01em',
          }}>
            {flight?.to || '—'}
          </p>
          <p style={{ fontSize: '0.68rem', color: '#475569', margin: '2px 0 0', fontWeight: 500 }}>To</p>
        </div>
      </div>

      {/* ── Detail grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '1rem',
      }}>
        {[
          { label: 'Flight Date', value: flight?.date ? formatFlightDate(flight.date) : '—' },
          { label: 'Booked On', value: formatDate(booking.bookingDate || booking.createdAt) },
          { label: 'Seats', value: `${booking.numberOfSeats} seat${booking.numberOfSeats !== 1 ? 's' : ''}`, bold: true },
          {
            label: 'Total Paid',
            value: `$${booking.totalPrice?.toFixed(2)}`,
            accent: true,
            bold: true,
          },
        ].map((item) => (
          <div key={item.label} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '10px 12px',
          }}>
            <p style={{ fontSize: '0.67rem', color: '#475569', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {item.label}
            </p>
            <p style={{
              fontSize: '0.85rem',
              color: item.accent ? '#60a5fa' : item.bold ? '#e2e8f0' : '#94a3b8',
              fontWeight: item.bold ? 700 : 500,
              margin: 0,
            }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Error ── */}
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

      {/* ── Cancel button ── */}
      {isConfirmed && (
        <button
          onClick={handleCancel}
          disabled={loading}
          style={{
            width: '100%',
            padding: '9px 16px',
            borderRadius: '9px',
            border: '1.5px solid rgba(239,68,68,0.3)',
            background: 'transparent',
            color: '#f87171',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            transition: 'all 0.2s',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
          onMouseEnter={e => {
            if (!loading) e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
          }}
          onMouseLeave={e => {
            if (!loading) e.currentTarget.style.background = 'transparent';
          }}
        >
          {loading ? 'Canceling...' : '✕ Cancel Booking'}
        </button>
      )}
    </motion.div>
  );
}