import React from 'react';
import Header from './Header';
import Footer from './Footer';
import TherapistsGrid from './TherapistsGrid';
import TrustBadges from './TrustBadges';

export default function IndiranagarPage() {
  return (
    <div className="app">
      <Header />
      <main>
        <section className="hero">
          <h1>Doorstep Massage in Indiranagar</h1>
          <p>Professional female therapists providing safe, relaxing massages in Indiranagar and surrounding areas. Your comfort and consent come first. Book instantly via WhatsApp.</p>
          <div className="local-testimonial">
            <p>"Excellent service in Indiranagar! The therapist was professional and arrived on time." - Rohan S.</p>
          </div>
          <a href="https://wa.me/917068344125?text=Hi%2C%20I%20would%20like%20to%20book%20a%20safe%20session%20in%20Indiranagar.%20src%3Dindiranagar-landing&utm_source=landing&utm_medium=organic&utm_campaign=indiranagar" className="btn" target="_blank">Book in Indiranagar</a>
        </section>
        <TrustBadges />
        <TherapistsGrid defaultZone="Indiranagar" />
      </main>
      <Footer />
    </div>
  );
}