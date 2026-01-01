import React from 'react';

export default function Pricing() {
  return (
    <section id="pricing" className="pricing-banner">
      <div className="pricing-card">
        <div className="pricing-head">
          <h2>Transparent Pricing</h2>
          <p className="muted">No hidden fees. Female-only, KYC-verified therapists.</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-item">
            <h3>Swedish</h3>
            <div className="price">₹1,500</div>
            <div className="duration">60 min</div>
            <ul>
              <li>Relaxation & stress relief</li>
              <li>Light–medium pressure</li>
            </ul>
          </div>
          <div className="pricing-item featured">
            <h3>Deep Tissue</h3>
            <div className="price">₹2,000</div>
            <div className="duration">60 min</div>
            <ul>
              <li>Pain relief & knots</li>
              <li>Medium–deep pressure</li>
            </ul>
          </div>
          <div className="pricing-item">
            <h3>Aromatherapy</h3>
            <div className="price">₹1,800</div>
            <div className="duration">60 min</div>
            <ul>
              <li>Essential oils add-on</li>
              <li>Relax & unwind</li>
            </ul>
          </div>
          <div className="pricing-item">
            <h3>Reflexology</h3>
            <div className="price">₹1,200</div>
            <div className="duration">45 min</div>
            <ul>
              <li>Foot pressure points</li>
              <li>Overall balance</li>
            </ul>
          </div>
        </div>
        <div className="pricing-ctas">
          <a className="btn" href="#availability">View Today's Availability</a>
          <a className="btn btn-outline" href="https://wa.me/917068344125?text=Hi%2C%20I%20want%20to%20book%20a%20session.%20src%3Dpricing">Book on WhatsApp</a>
        </div>
        <p className="smallprint">Travel fee may apply beyond cluster radius. Weekday offers available.</p>
      </div>
    </section>
  );
}