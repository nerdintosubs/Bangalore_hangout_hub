import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TherapistsGrid from './components/TherapistsGrid';
import Services from './components/Services';
import FAQ from './components/FAQ';
import ProviderSignup from './components/ProviderSignup';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import Availability from './components/Availability';
import CustomerSignup from './components/CustomerSignup';
import TrustBadges from './components/TrustBadges';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <TherapistsGrid />
        <Services />
        <CustomerSignup />
        <Availability />
        <FAQ />
        <ProviderSignup />
      </main>
      <StickyCTA />
      <Footer />
    </div>
  );
}

export default App;