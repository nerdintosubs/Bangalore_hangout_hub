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
import WaveDivider from './components/WaveDivider';
import Pricing from './components/Pricing';
import Reviews from './components/Reviews';
import CustomerLead from './components/CustomerLead';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <WaveDivider />
        <TrustBadges />
        <Pricing />
        <TherapistsGrid />
        <Services />
        <Reviews />
        <CustomerLead />
        <WaveDivider flip />
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