import React, { useState } from 'react';

export default function CustomerSignup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d - tz).toISOString().slice(0, 10);
  });

  const phoneWhatsApp = '917068344125';

  function submit(e) {
    e.preventDefault();
    const msg = encodeURIComponent(
`Customer Signup (request daily access code)
Name: ${name}
Phone: ${phone}
Area: ${area}
Date: ${date}
Source: customer-signup`
    );
    window.open(`https://wa.me/${phoneWhatsApp}?text=${msg}`, '_blank');
  }

  return (
    <section id="customer-signup" className="customer-signup">
      <h2>Get Today’s Access Code</h2>
      <p className="muted">Sign up and we’ll share the daily access code for the Customer Area (today’s available therapists).</p>
      <form onSubmit={submit} className="signup-form">
        <input value={name} onChange={e => setName(e.target.value)} name="name" placeholder="Your Name" required />
        <input value={phone} onChange={e => setPhone(e.target.value)} name="phone" placeholder="Phone (WhatsApp)" required />
        <input value={area} onChange={e => setArea(e.target.value)} name="area" placeholder="Your Area (e.g., Koramangala)" />
        <input value={date} onChange={e => setDate(e.target.value)} name="date" type="date" />
        <button type="submit" className="btn">Request Code on WhatsApp</button>
      </form>
    </section>
  );
}