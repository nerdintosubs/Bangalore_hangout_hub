import React, { useState } from 'react';

export default function Loyalty() {
  const [bookings, setBookings] = useState(3); // Example current bookings

  const tiers = [
    { min: 0, max: 4, name: "Welcome", perk: "Priority booking", progress: bookings / 5 },
    { min: 5, max: 9, name: "Regular", perk: "Free 10-min add-on", progress: Math.min(bookings / 10, 1) },
    { min: 10, max: 19, name: "VIP", perk: "Complimentary session", progress: Math.min(bookings / 20, 1) },
    { min: 20, max: Infinity, name: "Elite", perk: "Dedicated therapist", progress: 1 }
  ];

  const currentTier = tiers.find(tier => bookings >= tier.min && bookings <= tier.max) || tiers[0];
  const nextTier = tiers.find(tier => tier.min > bookings);

  return (
    <section id="loyalty" className="loyalty-section">
      <h2>Loyalty Program</h2>
      <p>Book more, unlock better perks! Your comfort and safety always come first.</p>

      <div className="loyalty-status">
        <div className="current-tier">
          <h3>Current Tier: {currentTier.name}</h3>
          <p>Bookings: {bookings}</p>
          <div className="perk">Current Perk: {currentTier.perk}</div>
        </div>

        {nextTier && (
          <div className="next-tier">
            <h4>Next: {nextTier.name}</h4>
            <p>{nextTier.min - bookings} more bookings to unlock {nextTier.perk}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(bookings / nextTier.min) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="tiers-grid">
        {tiers.map((tier, index) => (
          <div key={index} className={`tier-card ${bookings >= tier.min ? 'unlocked' : 'locked'}`}>
            <h4>{tier.name}</h4>
            <p>{tier.min}+ bookings</p>
            <div className="tier-perk">{tier.perk}</div>
          </div>
        ))}
      </div>

      <div className="referral-section">
        <h3>Refer a Friend</h3>
        <p>Share the safe, professional experience. Both you and your friend get a discount on the next booking!</p>
        <button className="btn">Share Referral Link</button>
      </div>
    </section>
  );
}