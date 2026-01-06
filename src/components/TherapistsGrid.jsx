import React, { useState, useEffect } from 'react';
import data from "../data/therapists.json";
import TherapistCard from "./TherapistCard";

export default function TherapistsGrid({ defaultZone = '' }) {
  const [filterZone, setFilterZone] = useState(defaultZone);
  const [filterSpecialty, setFilterSpecialty] = useState('');

  const zones = [...new Set(data.flatMap(t => t.zones))];
  const specialties = [...new Set(data.flatMap(t => t.specialties))];

  // Deep link: support #zone=Koramangala in URL hash
  useEffect(() => {
    const applyFromHash = () => {
      const m = window.location.hash.match(/zone=([^&]+)/i);
      if (m) {
        const z = decodeURIComponent(m[1]);
        if (zones.includes(z)) setFilterZone(z);
      }
    };
    applyFromHash();
    window.addEventListener('hashchange', applyFromHash);
    return () => window.removeEventListener('hashchange', applyFromHash);
  }, [zones]);

  const filteredData = data.filter(t => 
    (!filterZone || t.zones.includes(filterZone)) &&
    (!filterSpecialty || t.specialties.includes(filterSpecialty))
  );

  return (
    <section id="therapists" className="therapists-section">
      <h2>Our Therapists</h2>
      <div className="filter-section">
        <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)}>
          <option value="">All Zones</option>
          {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
        </select>
        <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)}>
          <option value="">All Specialties</option>
          {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
        </select>
      </div>
      <div className="therapists-grid">
        {filteredData.length > 0 ? (
          filteredData.map(t => <TherapistCard key={t.id} t={t} />)
        ) : (
          <p>No therapists match the selected filters.</p>
        )}
      </div>
    </section>
  );
}