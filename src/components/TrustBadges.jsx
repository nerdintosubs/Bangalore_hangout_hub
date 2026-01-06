import React from 'react';

export default function TrustBadges() {
  const badges = [
    { icon: '👩‍⚕️', title: 'Female-only', desc: 'KYC-verified therapists' },
    { icon: '🛡️', title: 'Consent-first', desc: 'Safe & professional' },
    { icon: '⚡', title: 'Fast Booking', desc: 'WhatsApp in 1 tap' },
    { icon: '📍', title: 'Near You', desc: 'Popular BLR zones' },
    { icon: '⏰', title: 'On-time Guarantee', desc: 'Arrives within 15 min or free' },
  ];

  return (
    <section className="trust-badges">
      <div className="badges-grid">
        {badges.map((b, i) => (
          <div className="badge-card" key={i}>
            <div className="badge-icon" aria-hidden="true">{b.icon}</div>
            <div className="badge-title">{b.title}</div>
            <div className="badge-desc">{b.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}