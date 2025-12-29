import React, { useEffect, useMemo, useState } from 'react';
import availability from '../data/availability.json';
import therapists from '../data/therapists.json';
import TherapistCard from './TherapistCard';

function todayLocalISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d - tz).toISOString().slice(0, 10);
}

export default function Availability() {
  const [date, setDate] = useState(todayLocalISO());
  const [pass, setPass] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');

  const record = availability[date];

  // Pre-fill from sessionStorage or hash (?/#pass=CODE)
  useEffect(() => {
    const ssKey = `availPass:${date}`;
    const saved = sessionStorage.getItem(ssKey);
    if (saved && record && saved === record.pass) {
      setUnlocked(true);
      setPass(saved);
    } else {
      const m = (window.location.hash + window.location.search).match(/pass=([^&]+)/i);
      if (m && record && decodeURIComponent(m[1]) === record.pass) {
        setUnlocked(true);
        setPass(record.pass);
        sessionStorage.setItem(ssKey, record.pass);
      }
    }
  }, [date, record]);

  // If today's data missing, optionally fall back to the latest available date
  const latestDate = useMemo(() => {
    const keys = Object.keys(availability).sort().reverse();
    return keys[0] || date;
  }, []);

  useEffect(() => {
    if (!record && latestDate) {
      setDate(prev => (availability[prev] ? prev : latestDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);

  const todaysTherapists = useMemo(() => {
    if (!record) return [];
    return record.therapists
      .map(id => therapists.find(t => t.id === id))
      .filter(Boolean);
  }, [record]);

  function handleUnlock(e) {
    e.preventDefault();
    if (!record) {
      setMessage('No availability published for the selected date.');
      setUnlocked(false);
      return;
    }
    if (pass.trim() === record.pass) {
      setUnlocked(true);
      setMessage('Access granted.');
      sessionStorage.setItem(`availPass:${date}`, record.pass);
    } else {
      setUnlocked(false);
      setMessage('Invalid access code. Please recheck.');
    }
  }

  return (
    <section id="availability" className="availability">
      <h2>Customer Area (Access Code Required)</h2>

      <div className="lock-box">
        <div className="row">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        {!unlocked && (
          <form className="lock-form" onSubmit={handleUnlock}>
            <input
              type="password"
              placeholder="Enter daily access code"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
            />
            <button className="btn" type="submit">Unlock</button>
          </form>
        )}

        {!!message && (
          <div className={`status ${unlocked ? 'ok' : 'err'}`}>{message}</div>
        )}

        {record && unlocked && (
          <div className="availability-body">
            <div className="note">
              <strong>Note:</strong> {record.note}
            </div>

            <div className="therapists-grid">
              {todaysTherapists.length > 0 ? (
                todaysTherapists.map(t => (
                  <TherapistCard key={t.id} t={t} source="availability" />
                ))
              ) : (
                <p>No therapists available for this date.</p>
              )}
            </div>
          </div>
        )}

        {!record && (
          <div className="status info">
            Availability not yet published for this date. Please check back later.
          </div>
        )}
      </div>
    </section>
  );
}