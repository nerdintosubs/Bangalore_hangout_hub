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

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <WaveDivider />
        <TrustBadges />
        <TherapistsGrid />
        <Services />
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