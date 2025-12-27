import data from "../data/therapists.json";
import TherapistCard from "./TherapistCard";

export default function TherapistsGrid() {
  return (
    <section>
      <h2>Our Therapists</h2>
      {data.map(t => <TherapistCard key={t.id} t={t} />)}
    </section>
  );
}