import React from 'react';

export default function Reviews() {
  const items = [
    {
      name: 'Aparna · Indiranagar',
      rating: 5,
      text:
        'Felt safe and very professional. Booked within 30 mins. Deep tissue really helped my neck pain.'
    },
    {
      name: 'Nidhi · Koramangala',
      rating: 5,
      text:
        'Loved the aromatherapy add‑on. On time, clean, and courteous. Rebooked for next week.'
    },
    {
      name: 'Shreya · HSR Layout',
      rating: 4,
      text:
        'Good experience overall. Therapist was verified and explained everything clearly.'
    }
  ];

  return (
    <section id="reviews" className="reviews">
      <h2>What Customers Say</h2>
      <div className="reviews-grid">
        {items.map((r, i) => {
          const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
          return (
            <div className="review-card" key={i}>
              <div className="review-stars" aria-label={`${r.rating} out of 5`}>{stars}</div>
              <p className="review-text">“{r.text}”</p>
              <div className="review-name">{r.name}</div>
            </div>
          );
        })}
      </div>
      <div className="reviews-cta">
        <a
          className="btn btn-outline"
          href="https://www.google.com/search?q=BLR+Hangout+Hub+reviews"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Google Reviews
        </a>
      </div>
    </section>
  );
}