export default function ProviderSignup() {
  function submit(e) {
    e.preventDefault();
    const f = e.target;
    const msg = encodeURIComponent(
      `Provider Signup:
Name: ${f.name.value}
Phone: ${f.phone.value}
Experience: ${f.experience.value}
Specialties: ${f.specialties.value}
Certifications: ${f.certifications.value}
Source: provider-signup`
    );
    window.open(`https://wa.me/917068344125?text=${msg}`);
  }
  return (
    <section id="signup">
      <h2>Become a Provider</h2>
      <p>Join our network of certified female therapists. We handle bookings and payments.</p>
      <form onSubmit={submit} className="signup-form">
        <input name="name" placeholder="Full Name" required />
        <input name="phone" placeholder="Phone (WhatsApp)" required />
        <input name="experience" placeholder="Experience (years)" required />
        <input name="specialties" placeholder="Specialties (e.g., Swedish, Aromatherapy)" required />
        <input name="certifications" placeholder="Certifications" />
        <button type="submit" className="btn">Submit via WhatsApp</button>
      </form>
    </section>
  );
}