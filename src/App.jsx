import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TherapistsGrid from './components/TherapistsGrid';
import Services from './components/Services';
import FAQ from './components/FAQ';
import ProviderSignup from './components/ProviderSignup';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <TherapistsGrid />
        <Services />
        <FAQ />
        <ProviderSignup />
      </main>
      <StickyCTA />
      <Footer />
    </div>
  );
}

export default App;
