import React from 'react';

export default function StickyCTA() {
  const phone = '917068344125';
  const text = encodeURIComponent('Hi, I would like to book a session. source=sticky-cta');

  return (
    <div className="sticky-cta" role="complementary" aria-label="Quick booking actions">
      <a
        className="btn"
        href={`https://wa.me/${phone}?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book on WhatsApp"
      >
        WhatsApp
      </a>
      <a
        className="btn btn-outline"
        href={`tel:+${phone}`}
        aria-label="Call Now"
      >
        Call
      </a>
    </div>
  );
}
