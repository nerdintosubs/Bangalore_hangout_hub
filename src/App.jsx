import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TherapistsGrid from './components/TherapistsGrid';
import Services from './components/Services';
import Safety from './components/Safety';
import FAQ from './components/FAQ';
import ProviderSignup from './components/ProviderSignup';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <TherapistsGrid />
        <Services />
        <Safety />
        <FAQ />
        <ProviderSignup />
      </main>
      <Footer />
    </div>
  );
}

export default App;