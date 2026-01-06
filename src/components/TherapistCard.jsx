import React, { useState } from 'react';

export default function TherapistCard({ t, source = 'therapist-card' }) {
  const [showProfile, setShowProfile] = useState(false);
  const msg = encodeURIComponent(`Hi ${t.name}, I'd like to book a session in ${t.zones[0]}. Specialties: ${t.specialties.join(', ')}. Source: ${source}`);
  const stars = '★'.repeat(Math.floor(t.rating)) + '☆'.repeat(5 - Math.floor(t.rating));

  return (
    <>
      <div className="card">
        <img src={t.photo} alt={`Professional photo of ${t.name}, certified female therapist`} loading="lazy" decoding="async" width="600" height="400" />
        <h3>{t.name}</h3>
        <p className="bio">{t.bio}</p>
        <div className="rating" aria-label={`Rating: ${t.rating} out of 5 stars`}>{stars} ({t.rating}/5)</div>
        <ul className="specialties" aria-label="Specialties">
          {t.specialties.map((spec, idx) => (
            <li key={idx}>{spec}</li>
          ))}
        </ul>
        <p className="zones" aria-label="Available zones">Available in: {t.zones.join(', ')}</p>
        <p className="experience" aria-label="Years of experience">{t.experience_years} years experience</p>
        <div className="certifications" aria-label="Certifications">
          Certifications: {t.certifications.join(', ')}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => setShowProfile(true)} aria-label={`View detailed profile for ${t.name}`}>View Profile</button>
          <a href={`https://wa.me/917068344125?text=${msg}`} className="btn" target="_blank" rel="noopener noreferrer" aria-label={`Book a session with ${t.name} via WhatsApp`}>Book Now</a>
        </div>
      </div>

      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProfile(false)}>×</button>
            <img src={t.photo} alt={t.name} className="modal-photo" />
            <h2>{t.name}</h2>
            <p className="modal-bio">{t.bio}</p>
            <div className="modal-rating">{stars} ({t.rating}/5)</div>
            <h3>Specialties</h3>
            <ul className="modal-specialties">
              {t.specialties.map((spec, idx) => (
                <li key={idx}>{spec}</li>
              ))}
            </ul>
            <h3>Experience</h3>
            <p>{t.experience_years} years</p>
            <h3>Certifications</h3>
            <p>{t.certifications.join(', ')}</p>
            <h3>Available Zones</h3>
            <p>{t.zones.join(', ')}</p>
            {t.verified && <p className="verified">✓ Verified Therapist</p>}
            <a href={`https://wa.me/917068344125?text=${msg}`} className="btn modal-btn" target="_blank" rel="noopener noreferrer">Book Session</a>
          </div>
        </div>
      )}
    </>
  );
}