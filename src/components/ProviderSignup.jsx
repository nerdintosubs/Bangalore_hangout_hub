export default function ProviderSignup() {
  const ZONES = [
    "Koramangala",
    "Indiranagar",
    "HSR Layout",
    "Jayanagar",
    "Whitefield",
    "Marathahalli",
    "MG Road",
    "Domlur"
  ];

  // TODO: Replace with your real Google Form link
  const googleFormUrl = "https://forms.gle/PROVIDER_FORM_ID";

  function submit(e) {
    e.preventDefault();
    const f = e.target;

    const zones = Array.from(f.querySelectorAll('input[name="zones"]:checked')).map(i => i.value);
    const shifts = Array.from(f.querySelectorAll('input[name="shifts"]:checked')).map(i => i.value);

    const fresher = f.fresher.checked ? "Yes" : "No";

    const msg = encodeURIComponent(
`Provider Signup:
Name: ${f.name.value}
Phone: ${f.phone.value}
Residency: ${f.residency.value}
Willing to Relocate: ${f.relocate.value}
Zones: ${zones.join(', ') || 'NA'}
Shifts: ${shifts.join(', ') || 'NA'}
Fresher: ${fresher}
Experience: ${f.experience.value || '0'}
Specialties: ${f.specialties.value}
Certifications: ${f.certifications.value}
Source: provider-signup-v2`
    );
    window.open(\`https://wa.me/917068344125?text=\${msg}\`, '_blank');
  }

  return (
    <section id="signup">
      <h2>Become a Provider</h2>
      <p>We prioritize Bangalore-based female therapists and freshers willing to learn. Weekly payouts via UPI. Safety-first policy.</p>

      <div className="provider-actions" style={{display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'12px'}}>
        <a className="btn" href={googleFormUrl} target="_blank" rel="noopener noreferrer">Apply via Google Form</a>
        <a className="btn btn-outline" href="#signup-form">Quick Apply via WhatsApp</a>
      </div>

      <details style={{marginBottom:'14px', background:'#fff', border:'1px solid #e6eef8', borderRadius:'8px', padding:'10px'}}>
        <summary style={{cursor:'pointer', fontWeight:600, color:'#4a90e2'}}>Prefer embedded form? Open here</summary>
        <div style={{marginTop:'10px'}}>
          <iframe
            title="Provider Google Form"
            src={googleFormUrl}
            width="100%"
            height="640"
            style={{border:'0', background:'#fff'}}
            loading="lazy"
          />
        </div>
      </details>

      <form id="signup-form" onSubmit={submit} className="signup-form">
        <input name="name" placeholder="Full Name" required />
        <input name="phone" placeholder="Phone (WhatsApp)" required />

        <select name="residency" defaultValue="Bangalore Resident" required>
          <option value="Bangalore Resident">Bangalore Resident</option>
          <option value="Relocating to Bangalore">Relocating to Bangalore</option>
          <option value="Outside Bangalore (not relocating)">Outside Bangalore (not relocating)</option>
        </select>

        <select name="relocate" defaultValue="Yes" required>
          <option value="Yes">Willing to relocate if required: Yes</option>
          <option value="No">Willing to relocate if required: No</option>
        </select>

        <label>
          <input type="checkbox" name="fresher" /> I am a fresher (01 yr)
        </label>

        <input name="experience" placeholder="Experience (years)" />
        <input name="specialties" placeholder="Specialties (e.g., Swedish, Aromatherapy)" />
        <input name="certifications" placeholder="Certifications (if any)" />

        <div>
          <strong>Preferred Zones (Bangalore)</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '6px', marginTop: '6px' }}>
            {ZONES.map(z => (
              <label key={z} style={{ background: '#fff', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <input type="checkbox" name="zones" value={z} /> {z}
              </label>
            ))}
          </div>
        </div>

        <div>
          <strong>Available Shifts</strong>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
            <label><input type="checkbox" name="shifts" value="Morning (712)" /> Morning (712)</label>
            <label><input type="checkbox" name="shifts" value="Afternoon (125)" /> Afternoon (125)</label>
            <label><input type="checkbox" name="shifts" value="Evening (510)" /> Evening (510)</label>
          </div>
        </div>

        <button type="submit" className="btn">Submit via WhatsApp</button>

        <p className="muted" style={{textAlign:'center', marginTop:'8px'}}>
          Prefer forms instead of WhatsApp? Use the Google Form above. We will reach out on the same day.
        </p>
      </form>
    </section>
  );
}