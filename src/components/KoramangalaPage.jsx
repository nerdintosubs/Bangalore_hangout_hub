import React from 'react';
import Header from './Header';
import Footer from './Footer';
import TherapistsGrid from './TherapistsGrid';
import TrustBadges from './TrustBadges';

export default function KoramangalaPage() {
  return (
    <div className="app">
      <Header />
      <main>
        <section className="hero">
          <h1>Doorstep Massage in Koramangala</h1>
          <p>Professional female therapists providing safe, relaxing massages in Koramangala and surrounding areas. Your comfort and consent come first. Book instantly via WhatsApp.</p>
          <div className="local-testimonial">
            <p>"Amazing service in Koramangala! The therapist was punctual and professional." - Priya K.</p>
          </div>
          <a href="https://wa.me/917068344125?text=Hi%2C%20I%20would%20like%20to%20book%20a%20safe%20session%20in%20Koramangala.%20src%3Dkoramangala-landing&utm_source=landing&utm_medium=organic&utm_campaign=koramangala" className="btn" target="_blank" rel="noopener noreferrer">Book in Koramangala</a>
        </section>
        <TrustBadges />
        <TherapistsGrid defaultZone="Koramangala" />
      </main>
      <Footer />
    </div>
  );
}