import React from 'react';

export default function CustomerLead() {
  // TODO: Replace with your real Google Form link for customer leads
  const googleFormUrl = "https://forms.gle/CUSTOMER_FORM_ID";

  return (
    <section id="lead" className="customer-lead">
      <h2>Get Today’s Access Code or Request a Callback</h2>
      <p className="muted" style={{ textAlign: 'center', marginTop: '-6px' }}>
        Share your area and preferred time — we’ll confirm availability on WhatsApp.
      </p>

      <div className="lead-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '14px' }}>
        <a className="btn" href={googleFormUrl} target="_blank" rel="noopener noreferrer">
          Customer Lead Form (Google)
        </a>
        <a className="btn btn-outline" href="#availability">
          View Today’s Availability
        </a>
      </div>

      <details style={{ margin: '0 auto 14px', background: '#fff', border: '1px solid #e6eef8', borderRadius: '8px', padding: '10px', maxWidth: 1000 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#4a90e2' }}>
          Prefer embedded form? Open here
        </summary>
        <div style={{ marginTop: '10px' }}>
          <iframe
            title="Customer Lead Google Form"
            src={googleFormUrl}
            width="100%"
            height="640"
            style={{ border: '0', background: '#fff' }}
            loading="lazy"
          />
        </div>
      </details>
    </section>
  );
}