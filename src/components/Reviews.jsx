import React from 'react';

export default function Reviews() {
  const reviews = [
    {
      name: "Priya K.",
      location: "Koramangala",
      rating: 5,
      text: "Amazing service! The therapist was punctual, professional, and made me feel completely comfortable. Highly recommend!",
      date: "2024-12-15"
    },
    {
      name: "Anjali M.",
      location: "Indiranagar",
      rating: 5,
      text: "Safe and professional doorstep massage. The female-only policy gives me peace of mind. Great experience!",
      date: "2024-12-12"
    },
    {
      name: "Sneha R.",
      location: "HSR Layout",
      rating: 5,
      text: "Excellent therapists and excellent service. Arrived exactly on time as promised. Will book again!",
      date: "2024-12-10"
    }
  ];

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <section id="reviews" className="reviews-section">
      <h2>What Our Clients Say</h2>
      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-header">
              <div className="reviewer-info">
                <h4>{review.name}</h4>
                <span className="location">{review.location}</span>
              </div>
              <div className="rating">{renderStars(review.rating)}</div>
            </div>
            <p className="review-text">"{review.text}"</p>
            <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}