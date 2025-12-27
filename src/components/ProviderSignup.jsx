export default function ProviderSignup() {
  function submit(e) {
    e.preventDefault();
    const f = e.target;
    const msg = encodeURIComponent(
      `Provider Signup:
Name: ${f.name.value}
Phone: ${f.phone.value}
Experience: ${f.experience.value}`
    );
    window.open(`https://wa.me/917068344125?text=${msg}`);
  }
  return (
    <section>
      <h2>Become a Provider</h2>
      <form onSubmit={submit}>
        <input name="name" placeholder="Full Name" required />
        <input name="phone" placeholder="Phone (WhatsApp)" required />
        <input name="experience" placeholder="Experience (years)" />
        <button type="submit">Submit via WhatsApp</button>
      </form>
    </section>
  );
}