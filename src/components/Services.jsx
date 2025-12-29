export default function Services() {
  return (
    <section id="services">
      <h2>Our Services</h2>
      <div className="services-grid">
        <div className="service-card">
          <h3>Swedish Massage</h3>
          <p>Relaxing full-body massage using gentle pressure. Perfect for stress relief.</p>
          <p className="price">₹1500 / 60 min</p>
        </div>
        <div className="service-card">
          <h3>Deep Tissue Massage</h3>
          <p>Targets deeper layers of muscle for pain relief and recovery.</p>
          <p className="price">₹2000 / 60 min</p>
        </div>
        <div className="service-card">
          <h3>Aromatherapy</h3>
          <p>Essential oils combined with massage for enhanced relaxation and healing.</p>
          <p className="price">₹1800 / 60 min</p>
        </div>
        <div className="service-card">
          <h3>Sports Massage</h3>
          <p>Focuses on athletes, improving flexibility and preventing injuries.</p>
          <p className="price">₹2200 / 60 min</p>
        </div>
        <div className="service-card">
          <h3>Thai Massage</h3>
          <p>Traditional stretching and acupressure for improved circulation.</p>
          <p className="price">₹1700 / 60 min</p>
        </div>
        <div className="service-card">
          <h3>Reflexology</h3>
          <p>Foot massage targeting reflex points for overall well-being.</p>
          <p className="price">₹1200 / 45 min</p>
        </div>
      </div>
    </section>
  );
}