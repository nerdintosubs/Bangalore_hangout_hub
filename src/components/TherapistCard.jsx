import React from 'react';

export default function TherapistCard({ t, source = 'therapist-card' }) {
  const msg = encodeURIComponent(`Hi ${t.name}, I'd like to book a session in ${t.zones[0]}. Specialties: ${t.specialties.join(', ')}. Source: ${source}`);
  const stars = '★'.repeat(Math.floor(t.rating)) + '☆'.repeat(5 - Math.floor(t.rating));

  return (
    <div className="card">
      <img src={t.photo} alt={t.name} loading="lazy" decoding="async" width="600" height="400" />
      <h3>{t.name}</h3>
      <p className="bio">{t.bio}</p>
      <div className="rating">{stars} ({t.rating}/5)</div>
      <ul className="specialties">
        {t.specialties.map((spec, idx) => (
          <li key={idx}>{spec}</li>
        ))}
      </ul>
      <p className="zones">Available in: {t.zones.join(', ')}</p>
      <p className="experience">{t.experience_years} years experience</p>
      <div className="certifications">
        Certifications: {t.certifications.join(', ')}
      </div>
      <a href={`https://wa.me/917068344125?text=${msg}`} className="btn" target="_blank" rel="noopener noreferrer">Book via WhatsApp</a>
    </div>
  );
}