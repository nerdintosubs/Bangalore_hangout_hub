import React from 'react';
import Header from './Header';
import Footer from './Footer';
import TherapistsGrid from './TherapistsGrid';
import TrustBadges from './TrustBadges';

export default function HSRPage() {
  return (
    <div className="app">
      <Header />
      <main>
        <section className="hero">
          <h1>Doorstep Massage in HSR Layout</h1>
          <p>Professional female therapists providing safe, relaxing massages in HSR Layout and surrounding areas. Your comfort and consent come first. Book instantly via WhatsApp.</p>
          <div className="local-testimonial">
            <p>"Great experience in HSR Layout! Safe, professional, and exactly on time." - Priya M.</p>
          </div>
          <a href="https://wa.me/917068344125?text=Hi%2C%20I%20would%20like%20to%20book%20a%20safe%20session%20in%20HSR%20Layout.%20src%3Dhsr-landing&utm_source=landing&utm_medium=organic&utm_campaign=hsr" className="btn" target="_blank">Book in HSR Layout</a>
        </section>
        <TrustBadges />
        <TherapistsGrid defaultZone="HSR Layout" />
      </main>
      <Footer />
    </div>
  );
}