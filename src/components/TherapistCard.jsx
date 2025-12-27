export default function TherapistCard({ t }) {
  const msg = encodeURIComponent(`Hi, I want to book ${t.name}`);
  return (
    <div className="card">
      <h3>{t.name}</h3>
      <p>{t.bio}</p>
      <a href={`https://wa.me/917068344125?text=${msg}`}>Book via WhatsApp</a>
    </div>
  );
}